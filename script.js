// angular.module('cnpjApp', [])
// .controller('CnpjController', function($scope, $http){
//     $scope.empresa = {
//         socios: []
//     };
//     $scope.editando = false;

//     $scope.consultarCNPJ = function() {
//         const cnpj = $scope.cnpj.replace(/[^0-9]/g, '');
//         const url = `https://brasilapi.com.br/api/cnpj/v1/${cnpj}`;

//         $http.get(url).then(function(response) {
//             const data = response.data;
//             $scope.empresa = {
//                 nome: data.nome_fantasia || '', 
//                 cnpjEmpr: data.cnpj_empresa || '',
//                 razaoSocial: data.razao_social || '',
//                 dataAbertura: data.data_abertura || '',
//                 situacao: data.descricao_situacao || '',
//                 atividadePrincipal: data.atividade_principal || '',
//                 enderecoEmpresarial: `${data.logradouro}, ${data.numero} - ${data.bairro}, ${data.municipio} - ${data.uf}, CEP: ${data.cep}`,
//                 telEmpresarial : data.telefone_empresarial || '',
//                 emailCoorp : data.email_coorporativo || ''
//             };
//         }).catch(function(error) {
//             console.error('Erro ao consultar o CNPJ:', error);
//         });
//     };

//     $scope.editar = function() {
//         $scope.editando = true;
//     };

//     $scope.salvar = function() {
//         $scope.editando = false;
//         localStorage.setItem('dadosEmpresa', JSON.stringify($scope.empresa));
//         $scope.reseForm();
        
 
//     };

//     $scope.carregarDados = function() {
//         const dadosSalvos = localStorage.getItem('dadosEmpresa');
//         if (dadosSalvos && dadosSalvos !== "undefined") {
//             try {
//                 $scope.empresa = JSON.parse(dadosSalvos);
//             } catch (e) {
//                 console.error("Erro ao carregar dados do localStorage:", e);
//                 $scope.empresa = { socios: [] }; // Re-inicializa se houver erro
//             }
//         }
//     };
//     $scope.resetForm = function() {
//         $scope.empresa = {
//             nome: '', 
//             razaoSocial: '',
//             dataAbertura: '',
//             situacao: '',
//             atividadePrincipal: '',
//             enderecoEmpresarial: '',
//             telEmpresarial: '',
//             emailCoorp: '',
//             socios: []
//         };
        
//         // Limpar os inputs dos sócios
//         $scope.socio = {};
//     };

//     $scope.resetStorage = function(){
//                // Remover dados do localStorage
//                localStorage.removeItem('dadosEmpresa');
//                alert("Dados do Storage deletados")
//     }
//     $scope.adicionarSocio = function() {
//         if ($scope.novoSocio && $scope.novoSocio.nome && $scope.novoSocio.qualificacao) {
//             $scope.empresa.socios.push({
//                 nome: $scope.novoSocio.nome,
//                 qualificacao: $scope.novoSocio.qualificacao
//             });
//             $scope.novoSocio = {}; // Limpar campos após adicionar
//         }
//     };

//     $scope.removerSocio = function(index) {
//         if ($scope.empresa.socios && $scope.empresa.socios.length > 0) {
//             $scope.empresa.socios.splice(index, 1);
//         }
//     };

// });

angular.module('cnpjApp', ['ngRoute'])
.config(function($routeProvider){
    $routeProvider
    .when('/cadastro', {
        templateUrl: 'cadastro.html',
        controller: 'CadastroController'
    })
    .when('/consulta', {
        templateUrl: 'consulta.html',
        controller: 'ConsultaController'
    })
    .otherwise({
        redirectTo: '/consulta'
    });
    
})
// Serviço para gerenciar o armazenamento local
.service('storageService', function() {
    this.resetStorage = function() {
        localStorage.removeItem('dadosEmpresa');
        alert("Dados do Storage deletados");
    };

})



.controller('MainController', function($scope, storageService){
    $scope.resetStorage = function(){
        storageService.resetStorage();
        $scope.resetForm();
    }
    

})


// Função para formatar CNPJ



.controller('CadastroController', function($scope){
    $scope.formatCNPJ = function(cnpj) {
        cnpj = cnpj.replace(/\D/g, ''); // Remove caracteres não numéricos
        if (cnpj.length === 14) {
            return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
        }
        return cnpj; // Retorna sem formatação se não tiver 14 dígitos
    };

    $scope.salvar = function() {
        localStorage.setItem('dadosEmpresaSalvos', JSON.stringify($scope.empresa));
        $scope.resetForm();
    

    };

    $scope.empresa = JSON.parse(localStorage.getItem('dadosEmpresaSalvos')) || {
        nome: '',
        cnpjEmpr: '',
        razaoSocial: '',
        dataAbertura: '',
        situacao: '',
        atividadePrincipal: '',
        LogradouroEmp: '',
        numeroEmp: '',
        complementoEmp: '',
        bairroEmp: '',
        cidadeEmp: '',
        UFemp: '',
        cepEmp: '',
        telEmpresarial: '',
        emailCoorp: '',
        socios: []
    };
    $scope.resetForm = function() {
        $scope.empresa = {
            nome: '', 
            cnpjEmpr: '',
            razaoSocial: '',
            dataAbertura: '',
            situacao: '',
            atividadePrincipal: '',
            LogradouroEmp: '',
            numeroEmp: '',
            complementoEmp: '',
            bairroEmp: '',
            cidadeEmp: '',
            UFemp: '',
            cepEmp: '',
            telEmpresarial: '',
            emailCoorp: '',
            socios: []
        };
    };

   
    $scope.getFormattedCNPJ = function() {
        return formatCNPJ($scope.empresa.cnpjEmpr);
    };
    
})


.controller('ConsultaController', function($scope, $http){
    $scope.editando = false;

    $scope.consultarCNPJ = function() {
        const cnpj = $scope.cnpj.replace(/[^0-9]/g, '');
        const url = `https://brasilapi.com.br/api/cnpj/v1/${cnpj}`;
        // console.log("CNPJ Consultado:", cnpj);
        // const dadosSalvos = localStorage.getItem('dadosEmpresa');
        // console.log("Dados Salvos:", dadosSalvos);
        // if (dadosSalvos) {
        //     const empresaSalva = JSON.parse(dadosSalvos);
        //     console.log("CNPJ Salvo Recuperado:", empresaSalva.cnpjEmpr);

        //     // Verificar se o CNPJ consultado é igual ao CNPJ salvo
        //     if (empresaSalva.cnpjEmpr === cnpj) {
        //         $scope.empresa = empresaSalva;
        //         console.log("Empresa Encontrada:", $scope.empresa);
        //         alert('Dados carregados do localStorage.');
        //         return;
        //     } else {
        //         alert('CNPJ não encontrado no localStorage.');
        //     }
        // } else {
        //     alert('Nenhum dado encontrado no localStorage.');
        // }

        $http.get(url).then(function(response) {
            const data = response.data;
            $scope.empresa = {
                nome: data.nome_fantasia || '', 
                cnpjEmpr: data.cnpj_empresa || '',
                razaoSocial: data.razao_social || '',
                dataAbertura: data.data_abertura || '',
                situacao: data.descricao_situacao || '',
                atividadePrincipal: data.atividade_principal || '',
                LogradouroEmp: data.logradouro || '',
                numeroEmp: data.logradouro || '',
                complementoEmp: data.complemento || '',
                bairroEmp: data.bairro || '',
                cidadeEmp: data.municipio || '',
                UFemp: data.uf || '',
                cepEmp: data.cep || '',
                telEmpresarial : data.telefone_empresarial || '',
                emailCoorp : data.email_coorporativo || '',
                socios: data.qsa ? data.qsa.map(socio => ({
                    nome: socio.nome_socio,
                    qualificacao: socio.qualificacao_socio
                })) : []
            };
        }).catch(function(error) {
            console.error('Erro ao consultar o CNPJ:', error);
        });
    };

    $scope.salvarEdicao = function() {
        $scope.editado = true;
        localStorage.setItem('dadosEmpresaEditados', JSON.stringify($scope.empresa));
        alert('Dados editados salvos com sucesso no LocalStorage!');
        
        // Resetando o formulário
        $scope.resetForm();
    
        // Recupera os dados imediatamente após o reset
        $scope.empresa = JSON.parse(localStorage.getItem('dadosEmpresaEditados'));
        $scope.editado = true;
    };
    

    $scope.resetForm = function() {
        $scope.empresa = {
            nome: '', 
            cnpjEmpr: '',
            razaoSocial: '',
            dataAbertura: '',
            situacao: '',
            atividadePrincipal: '',
            LogradouroEmp: '',
            numeroEmp: '',
            complementoEmp: '',
            bairroEmp: '',
            cidadeEmp: '',
            UFemp: '',
            cepEmp: '',
            telEmpresarial: '',
            emailCoorp: '',
            socios: []
        };
        //$scope.editado = false;  // Resetando o estado de editado
    };
    
    $scope.carregarDados = function() {
        const dadosEditados = localStorage.getItem('dadosEmpresaEditados');
        if(dadosEditados) {
            $scope.empresa = JSON.parse(dadosEditados);
            $scope.editado = true;
        }
    };
    

    $scope.adicionarSocio = function() {
        if ($scope.novoSocio && $scope.novoSocio.nome && $scope.novoSocio.qualificacao) {
            $scope.empresa.socios.push({
                nome: $scope.novoSocio.nome,
                qualificacao: $scope.novoSocio.qualificacao
            });
            $scope.novoSocio = {}; // Limpar campos após adicionar
        }
    };

    $scope.removerSocio = function(index) {
        if ($scope.empresa.socios && $scope.empresa.socios.length > 0) {
            $scope.empresa.socios.splice(index, 1);
        }
    };
});


