// Definindo o módulo AngularJS
angular.module('cnpjApp', [])
.service('storageService', function() {
    this.resetStorage = function() {
        localStorage.removeItem('dadosEmpresaEditados');
        alert('Storage resetado com sucesso!');
    };
})
.controller('CnpjController', function($scope, $http){
    $scope.editado = false;

    $scope.consultarCNPJ = function() {
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
        $scope.editado = false;
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
})
.controller('MainController', function($scope, storageService){
   
    $scope.resetStorage = function(){
        storageService.resetStorage();
        $scope.resetForm();
       
    };
});