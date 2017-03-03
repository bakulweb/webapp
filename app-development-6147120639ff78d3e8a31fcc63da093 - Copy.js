/*
1. cd path/project
2. uglifyjs app-development-6147120639ff78d3e8a31fcc63da093.js --compress --mangle -o app-6147120639ff78d3e8a31fcc63da093.js
*/

angular.module('brillpos', [
'ui.router',
])
.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $httpProvider) {
	$urlRouterProvider.otherwise('/dashboard')
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
	.state('dashboard', {url: '/dashboard', template: 'Dashboard', controller: 'AppCtrl'})
	.state('catalog', {url: '/catalog', templateUrl: 'templates/shared/index-6147120639ff78d3e8a31fcc63da093.html'})
	.state('catalog.list', {url: '/list', templateUrl: 'templates/catalog_list-6147120639ff78d3e8a31fcc63da093.html'})
}])
.controller('AppCtrl', ['$rootScope', '$scope', '$location', 'Auth', 'Storage', function($rootScope, $scope, $location, Auth, Storage) {
	/*Storage.set('user_auth', {
		'username': 'brillpos@gmail.com'
	})*/
}])
.controller('LoginCtrl', ['$rootScope', '$scope', '$location', 'Auth', 'Storage', function($rootScope, $scope, $location, Auth, Storage) {
	
}])
.controller('SignupCtrl', ['$rootScope', '$scope', '$location', 'Auth', 'Storage', '$http', 'MyServices', '$timeout',
	function($rootScope, $scope, $location, Auth, Storage, $http, MyServices, $timeout) {
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
					$scope.username_exist = err.username
					$scope.storename_exist = err.store_name
					$scope.confpassword_match = err.confirm_password
					$scope.min_length = err.min_length
					console.log(err)
				})
			}
		}
	}
])
.controller('ExampleCtrl', ['$rootScope', '$scope', '$location', 'Auth', 'Storage', function($rootScope, $scope, $location, Auth, Storage) {
	
}])
.service('Auth', ['$rootScope', '$location', 'Storage', function($rootScope, $location, Storage) {
	$rootScope.$on('$viewContentLoaded', function(event) {
		$urlExecption = ['/login', '/signup', '/signup-success']		
		if($urlExecption.indexOf($location.path()) < 0) {
			Storage.get('user_auth')
			.then(function(user) {
				if(!user) {			
					$location.path('/login')
				}
			})
		}
	})
}])
.service('MyServices', ['$q', '$rootScope', '$http', function($q, $rootScope, $http) {
	function getProvinces() {
		return $q(function(resolve, reject) {
			$http.get('http://localhost:81/brillpos/api/v1/br/provinces')
			.then(function(res) {
				resolve(res.data)
			})
		})
	}

	function signup(param) {
		return $q(function(resolve, reject) {
			$http.post('http://localhost:81/brillpos/api/v1/signup', param)
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