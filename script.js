// Definindo o módulo AngularJS
angular.module('cnpjApp', ['ui.mask'])
.service('storageService', function() {
    this.resetStorage = function(showModal) {
        localStorage.removeItem('dadosEmpresaEditados');
        
        if (showModal === 'localStorage') {
            $('#resetModalLocalStorage').modal('show');
        } else if (showModal === 'api') {
            $('#resetModalApi').modal('show');
        }
    };
    
})

.controller('CnpjController', function($scope, $http){
    $scope.editado = false;

    $scope.consultarCNPJ = function() {
        const cnpj = $scope.cnpj.replace(/[^0-9]/g, '');
        const url = `https://brasilapi.com.br/api/cnpj/v1/${cnpj}`;
       
        
    
        $http.get(url).then(function(response) {
            const data = response.data;
            const dataAberturaOriginal = data.data_inicio_atividade || '';
            const dataAberturaFormatada = dataAberturaOriginal ? dataAberturaOriginal.split('-').reverse().join('/') : '';
          
    
            $scope.empresa = {
                nome: data.nome_fantasia || '', 
                cnpjEmpr: data.cnpj || '',  // Updated field name
                razaoSocial: data.razao_social || '',
                dataAbertura: dataAberturaFormatada,
                situacao: data.descricao_situacao_cadastral || '',
                atividadePrincipal: data.cnae_fiscal_descricao || '',
                LogradouroEmp: data.logradouro|| '',
                numeroEmp: data.numero || '',
                complementoEmp: data.complemento || '',
                bairroEmp: data.bairro || '',
                cidadeEmp: data.municipio || '',
                ufemp: data.uf || '',
                cepEmp: data.cep || '',
                telEmpresarial : data.ddd_telefone_1 || '',
                emailCoorp : data.email || '',
                socios: data.qsa ? data.qsa.map(socio => ({
                    nome: socio.nome_socio,
                    qualificacao: socio.qualificacao_socio
                })) : []
            };
            $scope.botaoResetHabilitado = true;
          
        }).catch(function(error) {
            console.error('Erro ao consultar o CNPJ:', error);
        });
    };
   
    $scope.salvarEdicao = function() {
        $scope.editado = true;
        localStorage.setItem('dadosEmpresaEditados', JSON.stringify($scope.empresa));
       
        
        // Resetando o formulário
        $scope.resetForm();
        // Recupera os dados imediatamente após o reset
        $scope.empresa = JSON.parse(localStorage.getItem('dadosEmpresaEditados'));
        $scope.editado = true;
        $('#successModal').modal('show');
    };
    
    $scope.resetForm = function() {
        $scope.editado = false;
        $scope.empresa = false; // Esconder os dados da empresa após o reset
    };
    
    $scope.carregarDados = function() {
        const dadosEditados = localStorage.getItem('dadosEmpresaEditados');
        if(dadosEditados) {
            $scope.empresa = JSON.parse(dadosEditados);
            $scope.editado = true;
        }
    };
    
})
.controller('MainController', function($scope, storageService){
   
    $scope.resetStorage = function(){
        storageService.resetStorage();
        $scope.resetForm();
        $scope.empresa = false;
       
    };
});

