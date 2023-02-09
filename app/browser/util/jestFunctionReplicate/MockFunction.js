import { AliasExpectMethods } from "./ExpectMethods/util.js";

export function mockFn(fn = () => {}) {
    const privateProp = {
        onceFn: [],
        defaulFn: fn
    };

    const retFunc = function(...args) {
        retFunc.mock.calls.push(args);
        retFunc.mock.invocationCallOrder.push(retFunc.mock.calls.length);

        const result = (newTarget => {
            if (privateProp.onceFn.length > 0) {
                const onceFn = privateProp.onceFn.shift();
                if (onceFn) {
                    return new onceFn(...args);
                }
                return onceFn(...args);
            }
            if (newTarget) {
                return new privateProp.defaulFn(...args);
            }
            return privateProp.defaulFn(...args);
        })(new.target);

        if (new.target) {
            retFunc.mock.instances.push(new.target);
        }

        retFunc.mock.results.push({
            type: "return",
            value: result
        });

        return result;
    };

    retFunc.mock = {
        calls: [],
        instances: [],
        invocationCallOrder: [],
        results: []
    };

    retFunc.mockClear = function() {
        retFunc.mock.calls = [];
        retFunc.mock.instances = [];
        retFunc.mock.invocationCallOrder = [];
        retFunc.mock.results = [];
        return retFunc;
    };

    retFunc.mockReset = function() {
        retFunc.mockClear();
        privateProp.onceFn = [];
        privateProp.defaulFn = fn;
        return retFunc;
    };

    retFunc.mockImplementation = function(defaulFn) {
        privateProp.defaulFn = defaulFn;
        return retFunc;
    };

    retFunc.mockImplementationOnce = function(fn) {
        privateProp.onceFn.push(fn);
        return retFunc;
    };

    retFunc.mockReturnThis = function() {
        retFunc.mockImplementation(() => this);
        return retFunc;
    };

    retFunc.mockReturnValue = function(value) {
        retFunc.mockImplementation(() => value);
        return retFunc;
    };

    retFunc.mockReturnValueOnce = function(value) {
        retFunc.mockImplementationOnce(() => value);
        return retFunc;
    };

    retFunc.mockResolvedValue = function(value) {
        retFunc.mockImplementation(() => Promise.resolve(value));
    };

    retFunc.mockResolvedValueOnce = function(value) {
        retFunc.mockImplementationOnce(() => Promise.resolve(value));
    };

    retFunc.mockRejectedValue = function(value) {
        retFunc.mockImplementation(() => Promise.reject(value));
    };

    retFunc.mockRejectedValueOnce = function(value) {
        retFunc.mockImplementationOnce(() => Promise.reject(value));
    };

    retFunc.mockName = function(name) {
        Object.defineProperty(privateProp, "name", { value: name });
    };

    retFunc.getMockName = function() {
        return privateProp.name;
    };

    retFunc.mockName("jest.fn()");

    retFunc.privateSymbol = mockFn.privateSymbol;

    return retFunc;
}

mockFn.privateSymbol = Symbol("mockFn");

mockFn.additionalExpectFunctions = {
    not: {
        toHaveBeenCalledTimes: {
            expected: {
                arg: {
                    type: _mockFn => {
                        return typeof _mockFn == "function" ? _mockFn.privateSymbol === mockFn.privateSymbol : false;
                    } // ! type is use with the primitiveValue and in the primitiveValue create the possibilty to use a function to check the type
                }
            },
            received: {
                args: {
                    length: 1,
                    0: {
                        type: "number"
                    }
                }
            },
            func: function(numOfCall) {
                const _mockFn = this.defaultVal;
                if (_mockFn.mock.calls.length !== numOfCall) {
                    this.setResult({
                        status: "success",
                        message: `Expected the function not to have been called ${numOfCall} times but it was called ${_mockFn.mock.calls.length} times`,
                        args: [numOfCall],
                        expected: this.defaultVal,
                        functionName: "toNotHaveBeenCalledTimes"
                    });
                } else {
                    this.setResult({
                        status: "fail",
                        message: `Expected the function not to have been called ${numOfCall} times but it was called ${_mockFn.mock.calls.length} times`,
                        args: [value],
                        expected: this.defaultVal,
                        functionName: "toNotHaveBeenCalledTimes",
                        error: new Error(`to not have been called ${numOfCall} times but it was called ${_mockFn.mock.calls.length} times`)
                    });
                }
                return this;
            }
        },
        toHaveBeenCalled: {
            expected: {
                arg: {
                    type: _mockFn => {
                        return typeof _mockFn == "function" ? _mockFn.privateSymbol === mockFn.privateSymbol : false;
                    } // ! type is use with the primitiveValue and in the primitiveValue create the possibilty to use a function to check the type
                }
            },
            received: {
                args: {
                    length: 0
                }
            },
            func: function() {
                const _mockFn = this.defaultVal;
                if (_mockFn.mock.calls.length === 0) {
                    this.setResult({
                        status: "success",
                        message: `Expected the function not to have been called but it was called ${_mockFn.mock.calls.length} times`,
                        args: [],
                        expected: this.defaultVal,
                        functionName: "toNotHaveBeenCalled"
                    });
                } else {
                    this.setResult({
                        status: "fail",
                        message: `Expected the function not to have been called but it was called ${_mockFn.mock.calls.length} times`,
                        args: [],
                        expected: this.defaultVal,
                        functionName: "toNotHaveBeenCalled",
                        error: new Error(`to not have been called but it was called ${_mockFn.mock.calls.length} times`)
                    });
                }
                return this;
            }
        },
        toHaveBeenCalledWith: {
            expected: {
                arg: {
                    type: _mockFn => {
                        return typeof _mockFn == "function" ? _mockFn.privateSymbol === mockFn.privateSymbol : false;
                    } // ! type is use with the primitiveValue and in the primitiveValue create the possibilty to use a function to check the type
                }
            },
            received: {
                args: {
                    length: -1 // -1 means that the number of args is not important
                }
            },
            func: function(...args) {
                const _mockFn = this.defaultVal;
                if (
                    !_mockFn.mock.calls.some(call => {
                        return call.every((arg, index) => {
                            return arg === args[index];
                        });
                    })
                ) {
                    this.setResult({
                        status: "success",
                        message: `Expected the function not to have been called with ${args} but it was called with ${_mockFn.mock.calls}`,
                        args: [args],
                        expected: this.defaultVal,
                        functionName: "toNotHaveBeenCalledWith"
                    });
                } else {
                    this.setResult({
                        status: "fail",
                        message: `Expected the function not to have been called with ${args} but it was called with ${_mockFn.mock.calls}`,
                        args: [args],
                        expected: this.defaultVal,
                        functionName: "toNotHaveBeenCalledWith",
                        error: new Error(`to not have been called with ${args} but it was called with ${_mockFn.mock.calls}`)
                    });
                }
                return this;
            }
        },
        toHaveBeenLastCalledWith: {
            expected: {
                arg: {
                    type: _mockFn => {
                        return typeof _mockFn == "function" ? _mockFn.privateSymbol === mockFn.privateSymbol : false;
                    } // ! type is use with the primitiveValue and in the primitiveValue create the possibilty to use a function to check the type
                }
            },
            received: {
                args: {
                    length: -1 // -1 means that the number of args is not important
                }
            },
            func: function(...args) {
                const _mockFn = this.defaultVal;
                if (_mockFn.mock.calls.length === 0) {
                    this.setResult({
                        status: "fail",
                        message: `Expected the function to have been called with ${args} but it was not called`,
                        args: [args],
                        expected: this.defaultVal,
                        functionName: "toNotHaveBeenLastCalledWith",
                        error: new Error(`to not have been called with ${args} but it was called with ${_mockFn.mock.calls}`)
                    });
                }
                const lastCall = _mockFn.mock.calls[_mockFn.mock.calls.length - 1];
                if (
                    lastCall.every((arg, index) => {
                        return arg === args[index];
                    })
                ) {
                    this.setResult({
                        status: "success",
                        message: `Expected the function not to have been called with ${args} but it was called with ${_mockFn.mock.calls}`,
                        args: [args],
                        expected: this.defaultVal,
                        functionName: "toNotHaveBeenLastCalledWith"
                    });
                } else {
                    this.setResult({
                        status: "fail",
                        message: `Expected the function not to have been called with ${args} but it was called with ${_mockFn.mock.calls}`,
                        args: [args],
                        expected: this.defaultVal,
                        functionName: "toNotHaveBeenLastCalledWith",
                        error: new Error(`to not have been called with ${args} but it was called with ${_mockFn.mock.calls}`)
                    });
                }
                return this;
            }
        },
        toHaveBeenNthCalledWith: {
            expected: {
                arg: {
                    type: _mockFn => {
                        return typeof _mockFn == "function" ? _mockFn.privateSymbol === mockFn.privateSymbol : false;
                    } // ! type is use with the primitiveValue and in the primitiveValue create the possibilty to use a function to check the type
                }
            },
            received: {
                args: {
                    length: -1 // -1 means that the number of args is not important
                }
            },
            func: function(nth, ...args) {
                const _mockFn = this.defaultVal;
                if (_mockFn.mock.calls.length < nth) {
                    this.setResult({
                        status: "fail",
                        message: `Expected the function to have been called with ${args} but it was not called`,
                        args: [nth, args],
                        expected: this.defaultVal,
                        functionName: "toNotHaveBeenNthCalledWith",
                        error: new Error(`to not have been called with ${args} but it was called with ${_mockFn.mock.calls}`)
                    });
                }
                const nthCall = _mockFn.mock.calls[nth - 1];
                if (
                    nthCall.every((arg, index) => {
                        return arg === args[index];
                    })
                ) {
                    this.setResult({
                        status: "success",
                        message: `Expected the function not to have been called with ${args} but it was called with ${_mockFn.mock.calls}`,
                        args: [nth, args],
                        expected: this.defaultVal,
                        functionName: "toNotHaveBeenNthCalledWith"
                    });
                } else {
                    this.setResult({
                        status: "fail",
                        message: `Expected the function not to have been called with ${args} but it was called with ${_mockFn.mock.calls}`,
                        args: [nth, args],
                        expected: this.defaultVal,
                        functionName: "toNotHaveBeenNthCalledWith",
                        error: new Error(`to not have been called with ${args} but it was called with ${_mockFn.mock.calls}`)
                    });
                }
            }
        },
        toHaveReturned: {
            expected: {
                arg: {
                    type: _mockFn => {
                        return typeof _mockFn == "function" ? _mockFn.privateSymbol === mockFn.privateSymbol : false;
                    } // ! type is use with the primitiveValue and in the primitiveValue create the possibilty to use a function to check the type
                }
            },
            received: {
                args: {
                    length: 1
                }
            },
            func: function(numOfCall) {
                const _mockFn = this.defaultVal;
                if (_mockFn.mock.results.length !== numOfCall) {
                    this.setResult({
                        status: "success",
                        message: `Expected the function to not have returned ${numOfCall} times but it returned ${_mockFn.mock.results.length} times`,
                        args: [numOfCall],
                        expected: this.defaultVal,
                        functionName: "toNotHaveReturned"
                    });
                } else {
                    this.setResult({
                        status: "fail",
                        message: `Expected the function to not have returned ${numOfCall} times but it returned ${_mockFn.mock.results.length} times`,
                        args: [numOfCall],
                        expected: this.defaultVal,
                        functionName: "toNotHaveReturned",
                        error: new Error(`to not have returned ${numOfCall} times but it returned ${_mockFn.mock.results.length} times`)
                    });
                }
            }
        }
    },
    toHaveBeenCalledTimes: {
        expected: {
            arg: {
                type: _mockFn => {
                    return typeof _mockFn == "function" ? _mockFn.privateSymbol === mockFn.privateSymbol : false;
                } // ! type is use with the primitiveValue and in the primitiveValue create the possibilty to use a function to check the type
            }
        },
        received: {
            args: {
                length: 1,
                0: {
                    type: "number"
                }
            }
        },
        func: function(numOfCall) {
            const _mockFn = this.defaultVal;
            if (_mockFn.mock.calls.length === numOfCall) {
                this.setResult({
                    status: "success",
                    message: `Expected the function to have been called ${numOfCall} times but it was called ${_mockFn.mock.calls.length} times`,
                    args: [numOfCall],
                    expected: this.defaultVal,
                    functionName: "toHaveBeenCalled"
                });
            } else {
                this.setResult({
                    status: "fail",
                    message: `Expected the function to have been called ${numOfCall} times but it was called ${_mockFn.mock.calls.length} times`,
                    args: [numOfCall],
                    expected: this.defaultVal,
                    functionName: "toHaveBeenCalled",
                    error: new Error(`to have been called ${numOfCall} times but it was called ${_mockFn.mock.calls.length} times`)
                });
            }
            return this;
        }
    },
    toHaveBeenCalled: {
        expected: {
            arg: {
                type: _mockFn => {
                    return typeof _mockFn == "function" ? _mockFn.privateSymbol === mockFn.privateSymbol : false;
                } // ! type is use with the primitiveValue and in the primitiveValue create the possibilty to use a function to check the type
            }
        },
        received: {
            args: {
                length: 0
            }
        },
        func: function() {
            const _mockFn = this.defaultVal;
            if (_mockFn.mock.calls.length > 0) {
                this.setResult({
                    status: "success",
                    message: `Expected the function to have been called but it was not called`,
                    args: [],
                    expected: this.defaultVal,
                    functionName: "toHaveBeenCalled"
                });
            } else {
                this.setResult({
                    status: "fail",
                    message: `Expected the function to have been called but it was not called`,
                    args: [],
                    expected: this.defaultVal,
                    functionName: "toHaveBeenCalled",
                    error: new Error(`to have been called but it was not called`)
                });
            }
            return this;
        }
    },
    toHaveBeenCalledWith: {
        expected: {
            arg: {
                type: _mockFn => {
                    return typeof _mockFn == "function" ? _mockFn.privateSymbol === mockFn.privateSymbol : false;
                } // ! type is use with the primitiveValue and in the primitiveValue create the possibilty to use a function to check the type
            }
        },
        received: {
            args: {
                length: -1 // -1 means that the number of args is not important
            }
        },
        func: function(...args) {
            const _mockFn = this.defaultVal;
            if (
                _mockFn.mock.calls.some(call => {
                    return call.every((arg, index) => {
                        return arg === args[index];
                    });
                }, this)
            ) {
                this.setResult({
                    status: "success",
                    message: `Expected the function to have been called with ${args} but it was called with ${_mockFn.mock.calls}`,
                    args: args,
                    expected: this.defaultVal,
                    functionName: "toHaveBeenCalledWith"
                });
            } else {
                this.setResult({
                    status: "fail",
                    message: `Expected the function to have been called with ${args} but it was called with ${_mockFn.mock.calls}`,
                    args: args,
                    expected: this.defaultVal,
                    functionName: "toHaveBeenCalledWith",
                    error: new Error(`to have been called with ${args} but it was called with ${_mockFn.mock.calls}`)
                });
            }
            return this;
        }
    },
    toHaveBeenLastCalledWith: {
        expected: {
            arg: {
                type: _mockFn => {
                    return typeof _mockFn == "function" ? _mockFn.privateSymbol === mockFn.privateSymbol : false;
                } // ! type is use with the primitiveValue and in the primitiveValue create the possibilty to use a function to check the type
            }
        },
        received: {
            args: {
                length: -1 // -1 means that the number of args is not important
            }
        },
        func: function(...args) {
            const _mockFn = this.defaultVal;
            if (_mockFn.mock.calls.length === 0) {
                this.setResult({
                    status: "fail",
                    message: `Expected the function to have been called but it was not called`,
                    args: args,
                    expected: this.defaultVal,
                    functionName: "toHaveBeenLastCalledWith",
                    error: new Error(`to have been called but it was not called`)
                });
            }
            let lastCall = _mockFn.mock.calls[_mockFn.mock.calls.length - 1];
            if (
                lastCall.every((arg, index) => {
                    return arg === args[index];
                })
            ) {
                this.setResult({
                    status: "success",
                    message: `Expected the function to have been called with ${args} but it was called with ${lastCall}`,
                    args: args,
                    expected: this.defaultVal,
                    functionName: "toHaveBeenLastCalledWith"
                });
            } else {
                this.setResult({
                    status: "fail",
                    message: `Expected the function to have been called with ${args} but it was called with ${lastCall}`,
                    args: args,
                    expected: this.defaultVal,
                    functionName: "toHaveBeenLastCalledWith",
                    error: new Error(`to have been called with ${args} but it was called with ${lastCall}`)
                });
            }
            return this;
        }
    },
    toHaveBeenNthCalledWith: {
        expected: {
            arg: {
                type: _mockFn => {
                    return typeof _mockFn == "function" ? _mockFn.privateSymbol === mockFn.privateSymbol : false;
                } // ! type is use with the primitiveValue and in the primitiveValue create the possibilty to use a function to check the type
            }
        },
        received: {
            args: {
                length: -1 // -1 means that the number of args is not important
            }
        },
        func: function(nth, ...args) {
            const _mockFn = this.defaultVal;
            if (_mockFn.mock.calls.length < nth) {
                this.setResult({
                    status: "fail",
                    message: `Expected the function to have been called but it was not called`,
                    args: args,
                    expected: this.defaultVal,
                    functionName: "toHaveBeenNthCalledWith",
                    error: new Error(`to have been called but it was not called`)
                });
            }
            let nthCall = _mockFn.mock.calls[nth - 1];
            if (
                nthCall.every((arg, index) => {
                    return arg === args[index];
                })
            ) {
                this.setResult({
                    status: "success",
                    message: `Expected the function to have been called with ${args} but it was called with ${nthCall}`,
                    args: args,
                    expected: this.defaultVal,
                    functionName: "toHaveBeenNthCalledWith"
                });
            } else {
                this.setResult({
                    status: "fail",
                    message: `Expected the function to have been called with ${args} but it was called with ${nthCall}`,
                    args: args,
                    expected: this.defaultVal,
                    functionName: "toHaveBeenNthCalledWith",
                    error: new Error(`to have been called with ${args} but it was called with ${nthCall}`)
                });
            }
            return this;
        }
    },
    toHaveReturned: {
        expected: {
            arg: {
                type: _mockFn => {
                    return typeof _mockFn == "function" ? _mockFn.privateSymbol === mockFn.privateSymbol : false;
                } // ! type is use with the primitiveValue and in the primitiveValue create the possibilty to use a function to check the type
            }
        },
        received: {
            args: {
                length: 1
            }
        },
        func: function(numOfCall) {
            const _mockFn = this.defaultVal;
            if (_mockFn.mock.results.length !== numOfCall) {
                this.setResult({
                    status: "fail",
                    message: `Expected the function to have returned ${numOfCall} times but it returned ${_mockFn.mock.results.length} times`,
                    args: numOfCall,
                    expected: this.defaultVal,
                    functionName: "toHaveReturned",
                    error: new Error(`to have returned ${numOfCall} times but it returned ${_mockFn.mock.results.length} times`)
                });
            } else {
                this.setResult({
                    status: "success",
                    message: `Expected the function to have returned ${numOfCall} times but it returned ${_mockFn.mock.results.length} times`,
                    args: numOfCall,
                    expected: this.defaultVal,
                    functionName: "toHaveReturned"
                });
            }
            return this;
        }
    }
};

export const privateSymbol = mockFn.privateSymbol;
