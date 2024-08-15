angular.module('cnpjApp', [])
.controller('CnpjController', function($scope, $http){
    $scope.editando = false;

    $scope.consultarCNPJ = function() {
        console.log('Consultar')
        const cnpj = $scope.cnpj.replace(/[^0-9]/g, '');
        const url = `https://brasilapi.com.br/api/cnpj/v1/${cnpj}`;

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
                //enderecoEmpresarial: `${data.logradouro}, ${data.logradouro} - ${data.bairro}, ${data.municipio} - ${data.uf}, CEP: ${data.cep}`,
                telEmpresarial : data.telefone_empresarial || '',
                emailCoorp : data.email_coorporativo || '',
                socios: data.qsa ? data.qsa.map(socio => ({
                    nome: socio.nome_socio,
                    qualificacao: socio.qualificacao_socio
                })) : []
            };
      
    
        $scope.editar = function() {
            $scope.editando = true;
        };
    
        $scope.salvar = function() {
            $scope.editando = false;
            localStorage.setItem('dadosEmpresa', JSON.stringify($scope.empresa));
        };
    
        $scope.adicionarSocio = function() {
            if (!$scope.empresa.socios) {
                $scope.empresa.socios = [];
            }
            $scope.empresa.socios.push({ nome: '', qualificacao: '' });
        };

            // Carregar dados do localStorage, se existir
            const dadosSalvos = localStorage.getItem('dadosEmpresa');
            if (dadosSalvos) {
                $scope.empresa = JSON.parse(dadosSalvos);
            }
        }).catch(function(error) {
            console.error('Erro ao consultar o CNPJ:', error);
        });
    };

    $scope.editar = function() {
        $scope.editando = true;
    };

    $scope.salvar = function() {
        $scope.editando = false;
        localStorage.setItem('dadosEmpresa', JSON.stringify($scope.empresa));
    };

    $scope.adicionarSocio = function() {
        if (!$scope.empresa.socios) {
            $scope.empresa.socios = [];
        }
        $scope.empresa.socios.push({ nome: '', qualificacao: '' });
    };

    $scope.removerSocio = function(index) {
        $scope.empresa.socios.splice(index, 1);
    };
});




