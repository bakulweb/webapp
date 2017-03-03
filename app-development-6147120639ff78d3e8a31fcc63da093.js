/*
1. cd path/project
2. uglifyjs app-development-6147120639ff78d3e8a31fcc63da093.js --compress --mangle -o app-6147120639ff78d3e8a31fcc63da093.js
*/

angular.module('brillpos', [
'ui.router',
'ngCookies',
])
.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $httpProvider) {
	$httpProvider.interceptors.push('HTTPInterceptor')
	$urlRouterProvider.otherwise('/')
	
	$urlRouterProvider
	.when('product', 'product/list')
	/*.when('/app/setting', '/app/setting/outlet')
	.when('/app/customer', '/app/customer/list')
	*/
	/*.when(state.url, ['$match', '$stateParams', function ($match, $stateParams) {
    if($state.$current.navigable != state || !equalForKeys($match, $stateParams)) {
      $state.transitionTo(state, $match, false)
    }
	}])*/

	$stateProvider
	.state('login', {
		url: '/login', 
		templateUrl: 'templates/login-6147120639ff78d3e8a31fcc63da093.html', 
		controller: 'AccountCtrl',
		data: {
			cssUrl: 'assets/css/login-6147120639ff78d3e8a31fcc63da093.css'
		},
		controller: 'LoginCtrl'
	})
	.state('signup', {
		url: '/signup', 
		templateUrl: 'templates/signup-6147120639ff78d3e8a31fcc63da093.html',
		data: {
			cssUrl: 'assets/css/signup-6147120639ff78d3e8a31fcc63da093.css'
		},
		controller: 'SignupCtrl'
	})
	.state('signup_success', {
		url: '/signup-success',
		templateUrl: 'templates/signup_success-6147120639ff78d3e8a31fcc63da093.html',
	})
	.state('app', {url: '/', templateUrl: 'templates/shared/app-6147120639ff78d3e8a31fcc63da093.html', controller: 'AppCtrl'})
	.state('app.dashboard', {url: 'dashboard', templateUrl: 'templates/dashboard-6147120639ff78d3e8a31fcc63da093.html'})
	
	.state('app.customer', {url: '/customer', templateUrl: 'templates/shared/customer_index-6147120639ff78d3e8a31fcc63da083.html'})
	.state('app.customer.list', {url: '/list', templateUrl: 'templates/customer_list-6147120639ff78d3e8a31fcc63da093.html'})
	.state('app.customer.group', {url: '/groups', template: 'Customer Groups'})
	
	.state('app.setting', {url: '/setting', templateUrl: 'templates/shared/setting_index-6147120639ff78d3e8a31fcc63da083.html'})
	.state('app.setting.outlet', {
		url: '/outlet', 
		templateUrl: 'templates/outlet_list-6147120639ff78d3e8a31fcc63da093.html',
		controller: 'OutletCtrl'
	})
	.state('app.setting.outlet.add', {
		url: '/setting/outlet/add', 
		parent: 'app', 
		templateUrl: 'templates/outlet_form-6147120639ff78d3e8a31fcc63da093.html',
		controller: 'OutletCtrl'
	})

	.state('app.product', {url: 'product', templateUrl: 'templates/shared/product_index-6147120639ff78d3e8a31fcc63da083.html'})
	// .state('app.product.list', {
	.state('app.product.list', {
		url: '/list', 
		templateUrl: 'templates/product_list-6147120639ff78d3e8a31fcc63da093.html', 
		controller: 'ProductCtrl'
	})
	.state('app.product.add', {
		url: '/add',
		templateUrl: 'templates/product_form-6147120639ff78d3e8a31fcc63da093.html'
	})
	.state('app.product.edit', {
		url: '/product/:id/edit',
		parent: 'app',
		templateUrl: 'templates/product_form-6147120639ff78d3e8a31fcc63da093.html',
		controller: 'ProductCtrl'
	})
	.state('app.product.category', {url: '/category', templateUrl: 'templates/categories-6147120639ff78d3e8a31fcc63da093.html'})

}])
.controller('AppCtrl', ['$rootScope', '$scope', '$location', 'Auth', 'Storage', '$state', 
	function($rootScope, $scope, $location, Auth, Storage, $state) {
		$state.transitionTo($state.current)
		
		$scope.signout = function() {
			Storage.remove('user_auth')
			Auth.signout()
		}
		
		Auth.getUser()
		.then(function(user) {
			if(!user) {
				$location.path('/login')
			}
		})
	}
])
.controller('LoginCtrl', ['$rootScope', '$scope', '$location', 'Auth', '$timeout', 'Storage', 
	function($rootScope, $scope, $location, Auth, $timeout, Storage) {
		$rootScope.$on('$stateChangeStart', 
			function(event, toState, toParams, fromState, fromParams, options){
				console.log( toState )
			}
		)

		$scope.login = function(param) {
			if(param) {			
				Auth.login(param)
				.then(function(res) {			
					if(res) {	
						angular.element('#button-login').attr('disabled', 'disabled')
						angular.element('#button-login').text('Please wait...')
						$timeout(function() {
							$location.path('/dashboard')
						}, 1000)
					}
					$scope.error_login = null
				}, function(err) {
					angular.element('#button-login').removeAttr('disabled')
					$scope.error_login = err.error_login
				})
			}
		}
	}
])
.controller('SignupCtrl', ['$rootScope', '$scope', '$location', 'Storage', 'MyServices', '$timeout',
	function($rootScope, $scope, $location, Storage, MyServices, $timeout) {
		$scope.businessTypes = [
			'Food & Beverages',
			'Salons & Barbershops',
			'Fashion & Apparel',
			'Retail',
			'Other',
		]

		MyServices.getProvinces()
		.then(function(provinces) {
			$scope.provinces = provinces
		})

		$scope.signup = function(data) {
			$scope.username_exist = null
			$scope.storename_exist = null
			$scope.confpassword_match = null
			$scope.min_length = null
			if( data ) {
				angular.element('#button-signup').attr('disabled', 'disabled')
				MyServices.signup(data)
				.then(function(res) {
					if(res) {
						$timeout(function() {
							$location.path('/signup-success')
						}, 1000)
					}
				}, function(err) {		
					angular.element('#button-signup').removeAttr('disabled')			
					$scope.username_exist = err.username
					$scope.storename_exist = err.store_name
					$scope.confpassword_match = err.confirm_password
					$scope.min_length = err.min_length
				})
			}
		}
	}
])
.controller('ProductCtrl', ['$rootScope', '$scope', '$location', 'Auth', 'Storage', '$stateParams', '$filter', 'ProductManager', 'OutletManager', '$state', 
	function($rootScope, $scope, $location, Auth, Storage, $stateParams, $filter, ProductManager, OutletManager, $state) {
		ProductManager.list()
		OutletManager.list()

		if($stateParams.id) {

			console.log($stateParams.id)
		}

		$state.transitionTo($state.current)
	}
])
.controller('ExampleCtrl', ['$rootScope', '$scope', '$location', 'Auth', 'Storage', function($rootScope, $scope, $location, Auth, Storage) {
	
}])
.controller('OutletCtrl', ['$rootScope', '$scope', 'OutletManager', 'Storage',
	function($rootScope, $scope, OutletManager, Storage) {
		OutletManager.list()
		.then(function(outlets) {
			$scope.outlets = outlets
		})

		$scope.addOutlet = function(param) {
			param.merchant_id = Storage.get_item('user_auth').merchant_id
			OutletManager.add(param)
		}
	}
])
.factory('Auth', ['$rootScope', '$location', 'Storage', '$q', '$http', '$cookies',
	function($rootScope, $location, Storage, $q, $http, $cookies) {
		
		function getUser() {
			return Storage.get('user_auth').then(function(user) {
				if(user) {
					$rootScope.user = user	
					return $cookies.get('_session_id') || false
				}
				return
			})
		}

		function login(param) {
			return $q(function(resolve, reject) {				
				$http.post('/api/v1/login', param)
				.then(function(res) {
					if(res.data.error) {
						reject(res.data.error)
						return
					}
					else {
						resolve(res.data)
						Storage.set('user_auth', res.data)
						return
					}
				})
			})
		}

		function signout() {
			Storage.remove('user_auth')
			$http.get('http://www.brillpos.com/api/v1/logout')
			$location.path('/login')
		}

		return {
			getUser: getUser,
			login: login,
			signout: signout,
		}
	}
])
.service('MyServices', ['$q', '$rootScope', '$http', function($q, $rootScope, $http) {
	function getProvinces() {
		return $q(function(resolve, reject) {
			$http.get('http://www.brillpos.com/api/v1/br/provinces')
			.then(function(res) {
				resolve(res.data)
			})
		})
	}

	function signup(param) {
		return $q(function(resolve, reject) {
			$http.post('http://www.brillpos.com/api/v1/signup', param)
			.then(function(res) {				
				if(res.data.error) {
					reject(res.data.error)					
				}
				else {
					resolve(res.data)
				}
			})
		})
	}

	return {
		getProvinces: getProvinces,
		signup: signup,
	}

}])
.factory('ProductManager', ['$rootScope', '$q', '$http', 
	function($rootScope, $q, $http) {
		function products() {
			/*return $q(function(resolve, reject) {				
				return $http.get('/api/v1/product/get').then(
					function(res) {
						if(res.data) {
							$rootScope.products = res.data
							resolve(res.data)
						}
						else {
							reject(res.data)
						}
					}
				)
			})*/

			return $q(function(resolve, reject) {
				return $http({
					method: 'GET',
					url: '/api/v1/product/get',
					success: function(res) {
						$rootScope.products = res.data
						resolve(res.data)
						console.log(res.data)
					}
				})
			})			
		}

		return {
			list: products
		}
	}
])
.factory('OutletManager', ['$rootScope', '$q', '$http', '$location', 
	function($rootScope, $q, $http, $location) {
		function outlets() {
			/*return $q(function(resolve, reject) {
				return $http.get('/api/v1/outlet').then(
					function(res) {
						if(res.data) {
							$rootScope.outlets = res.data
							resolve(res.data)
						}
						else {
							reject(res.data)
						}
					}
				)
			})*/
			return $q(function(resolve, reject) {				
				return $http({
					method: 'GET',
					url: '/api/v1/outlet', 
					success: function(res) {
						$rootScope.outlets = res.data
						resolve(res.data)
					}
				})
			})
		}

		function add(param) {
			return $q(function(resolve, reject) {				
				$http.post('/api/v1/outlet/add', param)
				.then(function(res) {
					if(res.data) {
						$location.path('/app/setting/outlet')
					}
				})
			})
		}

		return {
			list: outlets,
			add: add,
		}
	}
])
.service('Storage', ['$window', '$q', function($window, $q) {
	return {
		get: function(key) {
			var deferred = $q.defer()
			deferred.resolve( JSON.parse($window.localStorage.getItem(key)) )
			return deferred.promise			
		},
		get_item: function(key) {
			return JSON.parse($window.localStorage.getItem(key))
		},
		set: function(key, value) {
			$window.localStorage.setItem( key, angular.toJson(value) )
		},
		remove: function(key) {
			return $window.localStorage.removeItem(key)
		}
	}
}])
.directive('head', ['$rootScope', '$compile', '$location', 
	function($rootScope, $compile, $location) {
		return {
			restrict: 'E',
			link: function(scope, elem, args) {
				$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams, options){
					var cssUrl = (typeof toState.data !== 'undefined' ? toState.data.cssUrl : null)
					var loginStyle = '<link id="login-css" rel="stylesheet" type="text/css" href="'+ cssUrl +'">'
					var signupStyle = '<link id="signup-css" rel="stylesheet" type="text/css" href="'+ cssUrl +'">'

					if(toState.url == '/login') {
						elem.append($compile(loginStyle)(scope))
					}
					else {
						if( angular.element('#login-css')[0] ) {
							angular.element('#login-css')[0].remove()
						}						
					}

					if(toState.url == '/signup') {
						elem.append($compile(signupStyle)(scope))
					}
					else {
						if( angular.element('#signup-css')[0] ) {
							angular.element('#signup-css')[0].remove()
						}						
					}
				})
			}
		}
	}
])
.factory('HTTPInterceptor', ['$q', '$location', 'Storage', '$cookies', 
	function($q, $location, Storage, $cookies) {
		return {
			'request': function(config) {
				// config.headers = config.headers || {}
				config.headers = {
					// 'Content-Type': 'application/x-www-form-urlencoded'
					'Accept': 'application/json',
					'Content-Type': 'application/json'

				}
				/*config.headers.common = {
					'Accept': 'application/json, text/plain, *﻿/﻿*'
				}*/
				/*if( Storage.get_item('user_auth') ) {
					config.headers.Authorization = 'Bearer ' + $cookies.get('_session_id')
				}*/
				return config
			},
			'requestError': function(response) {
				return $q.reject(response)

			},
			'response': function(response) {
				return response
			},
			'responseError': function(response) {
				if( response.status === 401 ) {
					$location.path('/login')
				}

				return $q.reject(response)
			},
		}
	}
])