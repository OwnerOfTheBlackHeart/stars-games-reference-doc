System.register("callback-event", [], function (exports_1, context_1) {
    "use strict";
    var highestId, CallbackManager;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            highestId = 0;
            CallbackManager = class CallbackManager {
                constructor() {
                    this.callbacks = [];
                }
                AddCallback(callback, runImmediately = false) {
                    const id = highestId++;
                    this.callbacks.push({ func: callback, id });
                    if (runImmediately && this.lastValue !== undefined) {
                        callback(this.lastValue);
                    }
                    return id;
                }
                RemoveCallback(callbackId) {
                    this.callbacks = this.callbacks.filter((callback) => callback.id !== callbackId);
                    return callbackId;
                }
                RunCallbacks(context) {
                    this.lastValue = context;
                    this.callbacks.forEach((callback) => callback.func(context));
                }
            };
            exports_1("CallbackManager", CallbackManager);
        }
    };
});
System.register("types/page", [], function (exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    function FindPage(directory, pageName) {
        return FindPageInner(directory, pageName, directory.baseUrl);
    }
    exports_2("FindPage", FindPage);
    function FindPageInner(directory, pageName, currentPath) {
        const page = directory.pages.find((page) => page.name === pageName);
        const mainPage = directory.pages.find((page) => page.name === directory.mainPage);
        let foundPage = { page: undefined, parents: [] };
        if (page) {
            foundPage.page = { ...page, url: page.external ? page.url : currentPath + "/" + page.url };
        }
        else {
            if (!directory.directories) {
                return undefined;
            }
            const foundDirectory = directory.directories.find((childDir) => {
                foundPage = FindPageInner(childDir, pageName, currentPath + "/" + childDir.baseUrl);
                return foundPage;
            });
        }
        if (foundPage) {
            foundPage.parents.unshift({ ...mainPage, url: mainPage.external ? mainPage.url : currentPath + "/" + mainPage.url });
        }
        return foundPage;
    }
    function isExternalPage(directory, pageName) {
        const page = isExternalPageInternal(directory, pageName);
        return page.external ? true : false;
    }
    exports_2("isExternalPage", isExternalPage);
    function isExternalPageInternal(directory, pageName) {
        let page = directory.pages.find((page) => page.name === pageName);
        if (page) {
            return page;
        }
        else {
            if (!directory.directories) {
                return undefined;
            }
            const foundDirectory = directory.directories.find((childDir) => {
                page = isExternalPageInternal(childDir, pageName);
                return page;
            });
        }
        return page;
    }
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("loader", [], function (exports_3, context_3) {
    "use strict";
    var globals;
    var __moduleName = context_3 && context_3.id;
    async function LoadGlobals() {
        const [directory] = await Promise.all([
            fetch("data/pages.json", { cache: "no-store" }).then((response) => response.json()),
        ]);
        globals.pageDirectory = directory;
    }
    return {
        setters: [],
        execute: async function () {
            exports_3("globals", globals = {
                pageDirectory: undefined,
            });
            await LoadGlobals();
        }
    };
});
System.register("utilities", [], function (exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    function showElement(element, scrolledTo) {
        if (element && scrolledTo) {
            element.scrollTop = scrolledTo.offsetTop;
            element.scrollLeft = scrolledTo.offsetLeft;
        }
    }
    exports_4("showElement", showElement);
    function showId(parentId, childId) {
        const parent = document.getElementById(parentId);
        const child = document.getElementById(childId);
        showElement(parent, child);
    }
    exports_4("showId", showId);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("io", ["callback-event", "loader", "types/page", "utilities"], function (exports_5, context_5) {
    "use strict";
    var callback_event_1, loader_1, page_1, utilities_1, headerQuery, footerQuery, contentQuery, headerPage, footerPage, defaultPage, titlePostface, Parameters, baseNavigateUrl, pageChangeManager;
    var __moduleName = context_5 && context_5.id;
    async function InitialLoad() {
        let pageName = GetActivePageName();
        const [header, footer, content] = await Promise.all([
            LoadIntoElement(headerPage, headerQuery),
            LoadIntoElement(footerPage, footerQuery),
            LoadIntoContent(pageName),
        ]);
        return { header, footer, content };
    }
    exports_5("InitialLoad", InitialLoad);
    function GetActivePageName() {
        const params = new URLSearchParams(location.search);
        let pageName = params.get(Parameters.pageName);
        pageName = pageName ? pageName : defaultPage;
        return pageName;
    }
    exports_5("GetActivePageName", GetActivePageName);
    function OnPopState(ev) {
        let pageName = GetActivePageName();
        LoadIntoContent(pageName).then(() => UpdateContentScroll());
    }
    exports_5("OnPopState", OnPopState);
    function InternalNavigate(foundPage, hash) {
        let url = baseNavigateUrl + foundPage.page.name;
        if (hash) {
            url += hash;
        }
        history.pushState(undefined, foundPage.page.title + titlePostface, url);
        OnPopState({});
    }
    exports_5("InternalNavigate", InternalNavigate);
    async function LoadIntoElement(pageName, queryString) {
        const foundPage = page_1.FindPage(loader_1.globals.pageDirectory, pageName);
        const element = document.querySelector(queryString);
        if (!foundPage) {
            throw new Error(`Could not find page "${pageName}"`);
        }
        else if (!element) {
            throw new Error(`Could not find element "${queryString}"`);
        }
        const pageContents = await fetch(foundPage.page.url)
            .then((response) => response.text())
            .catch(() => {
            throw new Error(`Could not find contents of "${pageName}"`);
        });
        element.scrollTop = 0;
        element.innerHTML = pageContents;
        return element;
    }
    async function LoadIntoContent(pageName) {
        const foundPage = page_1.FindPage(loader_1.globals.pageDirectory, pageName);
        const element = document.querySelector(contentQuery);
        if (!foundPage) {
            throw new Error(`Could not find page "${pageName}"`);
        }
        else if (!element) {
            throw new Error(`Could not find element "${contentQuery}"`);
        }
        const pageContents = await fetch(foundPage.page.url)
            .then((response) => response.text())
            .catch(() => {
            throw new Error(`Could not find contents of "${pageName}"`);
        });
        document.title = foundPage.page.title + titlePostface;
        element.scrollTop = 0;
        element.innerHTML = pageContents;
        UpdateContentScroll();
        pageChangeManager.RunCallbacks(foundPage);
        return element;
    }
    function UpdateContentScroll() {
        const contents = document.querySelector(contentQuery);
        if (location.hash) {
            const hashChild = document.querySelector(location.hash);
            utilities_1.showElement(contents, hashChild);
        }
        else {
            contents.scrollTop = 0;
        }
    }
    return {
        setters: [
            function (callback_event_1_1) {
                callback_event_1 = callback_event_1_1;
            },
            function (loader_1_1) {
                loader_1 = loader_1_1;
            },
            function (page_1_1) {
                page_1 = page_1_1;
            },
            function (utilities_1_1) {
                utilities_1 = utilities_1_1;
            }
        ],
        execute: function () {
            headerQuery = "#header";
            footerQuery = "#footer";
            contentQuery = "#page-area";
            headerPage = "header";
            footerPage = "footer";
            defaultPage = "home";
            titlePostface = " - Stars Games Reference Doc";
            (function (Parameters) {
                Parameters["pageName"] = "pageName";
            })(Parameters || (Parameters = {}));
            exports_5("Parameters", Parameters);
            exports_5("baseNavigateUrl", baseNavigateUrl = `index.html?${Parameters.pageName}=`);
            exports_5("pageChangeManager", pageChangeManager = new callback_event_1.CallbackManager());
        }
    };
});
System.register("custom-elements/ap-nav-link", ["io", "loader", "types/page"], function (exports_6, context_6) {
    "use strict";
    var io_1, loader_2, page_2, navLinkName, NavLink;
    var __moduleName = context_6 && context_6.id;
    return {
        setters: [
            function (io_1_1) {
                io_1 = io_1_1;
            },
            function (loader_2_1) {
                loader_2 = loader_2_1;
            },
            function (page_2_1) {
                page_2 = page_2_1;
            }
        ],
        execute: function () {
            exports_6("navLinkName", navLinkName = "ap-nav-link");
            NavLink = class NavLink extends HTMLAnchorElement {
                constructor() {
                    super();
                    this.onclick = (e) => {
                        if (!e.ctrlKey) {
                            this.navigate(e);
                        }
                    };
                }
                connectedCallback() {
                    if (!this.foundPage) {
                        const givenUrl = this.getAttribute("href");
                        let pageName = "";
                        if (givenUrl.includes("#")) {
                            [pageName, this.hash] = givenUrl.split("#");
                        }
                        else {
                            pageName = givenUrl;
                        }
                        this.foundPage = page_2.FindPage(loader_2.globals.pageDirectory, pageName);
                    }
                    let url = io_1.baseNavigateUrl + this.foundPage.page.name;
                    if (this.hash) {
                        url += this.hash;
                    }
                    this.setAttribute("href", url);
                }
                navigate(e) {
                    if (e) {
                        e.preventDefault();
                    }
                    if (this.foundPage.page.external) {
                        const url = this.hash ? this.foundPage.page.url + this.hash : this.foundPage.page.url;
                        window.open(url, "_blank");
                    }
                    else {
                        io_1.InternalNavigate(this.foundPage, this.hash);
                    }
                }
            };
            customElements.define(navLinkName, NavLink, { extends: "a" });
        }
    };
});
System.register("custom-elements/ap-dir-display", ["io", "custom-elements/ap-nav-link"], function (exports_7, context_7) {
    "use strict";
    var io_2, ap_nav_link_1, dirDisplayName, DirectoryDisplay;
    var __moduleName = context_7 && context_7.id;
    return {
        setters: [
            function (io_2_1) {
                io_2 = io_2_1;
            },
            function (ap_nav_link_1_1) {
                ap_nav_link_1 = ap_nav_link_1_1;
            }
        ],
        execute: function () {
            exports_7("dirDisplayName", dirDisplayName = "ap-dir-display");
            DirectoryDisplay = class DirectoryDisplay extends HTMLElement {
                constructor() {
                    super();
                    this.rendered = false;
                }
                connectedCallback() {
                    this.rendered = true;
                    this.callbackId = io_2.pageChangeManager.AddCallback((foundPage) => {
                        this.currentPage = foundPage;
                        if (this.rendered) {
                            this.render();
                        }
                    }, true);
                    this.render();
                }
                disconnectedCallback() {
                    this.rendered = false;
                    io_2.pageChangeManager.RemoveCallback(this.callbackId);
                }
                render() {
                    this.innerHTML = "";
                    this.container = document.createElement("div");
                    this.container.classList.add("ap-dir-display-container");
                    this.appendChild(this.container);
                    if (this.currentPage) {
                        this.currentPage.parents.forEach((parent, index) => {
                            const parentAnchor = document.createElement("a", { is: ap_nav_link_1.navLinkName });
                            parentAnchor.setAttribute("href", parent.name);
                            parentAnchor.innerText = parent.title;
                            parentAnchor.classList.add("ap-dir-display-link");
                            this.container.appendChild(parentAnchor);
                            const lastIndex = this.currentPage.parents.length - 1;
                            if (index < lastIndex) {
                                const spacer = document.createElement("span");
                                spacer.innerText = ">";
                                spacer.classList.add("ap-dir-display-spacer");
                                this.container.appendChild(spacer);
                            }
                        });
                    }
                }
            };
            customElements.define(dirDisplayName, DirectoryDisplay);
        }
    };
});
System.register("custom-elements/custom-elements", ["custom-elements/ap-nav-link", "custom-elements/ap-dir-display"], function (exports_8, context_8) {
    "use strict";
    var __moduleName = context_8 && context_8.id;
    return {
        setters: [
            function (_1) {
            },
            function (_2) {
            }
        ],
        execute: function () {
        }
    };
});
System.register("main", ["custom-elements/custom-elements", "io", "loader", "types/page"], function (exports_9, context_9) {
    "use strict";
    var io_3, loader_3, page_3;
    var __moduleName = context_9 && context_9.id;
    return {
        setters: [
            function (_3) {
            },
            function (io_3_1) {
                io_3 = io_3_1;
            },
            function (loader_3_1) {
                loader_3 = loader_3_1;
            },
            function (page_3_1) {
                page_3 = page_3_1;
            }
        ],
        execute: function () {
            window.test = (name) => {
                console.log(page_3.FindPage(loader_3.globals.pageDirectory, name));
            };
            io_3.InitialLoad().then(() => {
                onpopstate = io_3.OnPopState;
            });
        }
    };
});
