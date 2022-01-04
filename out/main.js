System.register("callback-event", [], function (exports_1, context_1) {
    "use strict";
    var highestId, CallbackManager;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            highestId = 0;
            CallbackManager = class CallbackManager {
                constructor(isUndefinedValid = false) {
                    this.callbacks = [];
                    this.isUndefinedValid = false;
                    this.isUndefinedValid = isUndefinedValid;
                }
                AddCallback(callback, runImmediately = false) {
                    const id = highestId++;
                    this.callbacks.push({ func: callback, id });
                    if (runImmediately && (this.isUndefinedValid || this.lastValue !== undefined)) {
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
System.register("types/auth-user", [], function (exports_2, context_2) {
    "use strict";
    var AuthUser;
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [],
        execute: function () {
            AuthUser = class AuthUser {
            };
            exports_2("AuthUser", AuthUser);
        }
    };
});
System.register("types/page", [], function (exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    function FindPage(directory, pageName) {
        return FindPageInner(directory, pageName, directory.baseUrl);
    }
    exports_3("FindPage", FindPage);
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
    exports_3("isExternalPage", isExternalPage);
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
System.register("loader", ["callback-event"], function (exports_4, context_4) {
    "use strict";
    var callback_event_1, globalsReady, _a, directory, users, globals;
    var __moduleName = context_4 && context_4.id;
    return {
        setters: [
            function (callback_event_1_1) {
                callback_event_1 = callback_event_1_1;
            }
        ],
        execute: async function () {
            exports_4("globalsReady", globalsReady = new callback_event_1.CallbackManager());
            _a = await Promise.all([
                fetch("data/pages.json", { cache: "no-store" }).then((response) => response.json()),
                fetch("data/auth.json", { cache: "no-store" }).then((response) => response.json()),
            ]), directory = _a[0], users = _a[1];
            exports_4("globals", globals = {
                pageDirectory: directory,
                users: users,
            });
            globalsReady.RunCallbacks();
        }
    };
});
System.register("auth-manager", ["callback-event", "loader"], function (exports_5, context_5) {
    "use strict";
    var callback_event_2, loader_1, currentNameToken, AuthManager;
    var __moduleName = context_5 && context_5.id;
    return {
        setters: [
            function (callback_event_2_1) {
                callback_event_2 = callback_event_2_1;
            },
            function (loader_1_1) {
                loader_1 = loader_1_1;
            }
        ],
        execute: function () {
            currentNameToken = "currentUserName";
            AuthManager = class AuthManager {
                static checkStoredUser() {
                    const userName = localStorage.getItem(currentNameToken);
                    const currentUser = loader_1.globals.users.find((user) => user.name === userName);
                    this.userChanged.RunCallbacks(currentUser);
                }
                static authorize(passphrase) {
                    const foundUser = loader_1.globals.users.find((user) => user.passphrase === passphrase);
                    if (foundUser) {
                        this.saveUser(foundUser);
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                static deauthorize() {
                    this.saveUser(undefined);
                }
                static saveUser(user) {
                    this.userChanged.RunCallbacks(user);
                    localStorage.setItem(currentNameToken, user ? user.name : "");
                }
            };
            exports_5("AuthManager", AuthManager);
            AuthManager.userChanged = new callback_event_2.CallbackManager(true);
            loader_1.globalsReady.AddCallback(() => AuthManager.checkStoredUser(), true);
        }
    };
});
System.register("utilities", [], function (exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
    function showElement(element, scrolledTo) {
        if (element && scrolledTo) {
            element.scrollTop = scrolledTo.offsetTop;
            element.scrollLeft = scrolledTo.offsetLeft;
        }
    }
    exports_6("showElement", showElement);
    function showId(parentId, childId) {
        const parent = document.getElementById(parentId);
        const child = document.getElementById(childId);
        showElement(parent, child);
    }
    exports_6("showId", showId);
    function buildCssStylesheetElement(path, addDotCss = true, addOutPath = false) {
        const href = `${addOutPath ? "out/styles/" : ""}${path}${addDotCss ? ".css" : ""}`;
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.type = "text/css";
        link.setAttribute("href", href);
        return link;
    }
    exports_6("buildCssStylesheetElement", buildCssStylesheetElement);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("io", ["callback-event", "loader", "types/page", "utilities"], function (exports_7, context_7) {
    "use strict";
    var callback_event_3, loader_2, page_1, utilities_1, headerQuery, footerQuery, contentQuery, headerPage, footerPage, defaultPage, titlePostface, Parameters, baseNavigateUrl, pageChangeManager;
    var __moduleName = context_7 && context_7.id;
    async function InitialLoad() {
        let pageName = GetActivePageName();
        const [header, footer, content] = await Promise.all([
            LoadIntoElement(headerPage, headerQuery),
            LoadIntoElement(footerPage, footerQuery),
            LoadIntoContent(pageName),
        ]);
        return { header, footer, content };
    }
    exports_7("InitialLoad", InitialLoad);
    function GetActivePageName() {
        const params = new URLSearchParams(location.search);
        let pageName = params.get(Parameters.pageName);
        pageName = pageName ? pageName : defaultPage;
        return pageName;
    }
    exports_7("GetActivePageName", GetActivePageName);
    function OnPopState(ev) {
        let pageName = GetActivePageName();
        LoadIntoContent(pageName).then(() => UpdateContentScroll());
    }
    exports_7("OnPopState", OnPopState);
    function InternalNavigate(foundPage, hash) {
        let url = baseNavigateUrl + foundPage.page.name;
        if (hash) {
            url += hash;
        }
        history.pushState(undefined, foundPage.page.title + titlePostface, url);
        OnPopState({});
    }
    exports_7("InternalNavigate", InternalNavigate);
    async function LoadIntoElement(pageName, queryString) {
        const foundPage = page_1.FindPage(loader_2.globals.pageDirectory, pageName);
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
        const foundPage = page_1.FindPage(loader_2.globals.pageDirectory, pageName);
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
            function (callback_event_3_1) {
                callback_event_3 = callback_event_3_1;
            },
            function (loader_2_1) {
                loader_2 = loader_2_1;
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
            exports_7("Parameters", Parameters);
            exports_7("baseNavigateUrl", baseNavigateUrl = `index.html?${Parameters.pageName}=`);
            exports_7("pageChangeManager", pageChangeManager = new callback_event_3.CallbackManager());
        }
    };
});
System.register("custom-elements/ap-nav-link", ["io", "loader", "types/page"], function (exports_8, context_8) {
    "use strict";
    var io_1, loader_3, page_2, navLinkName, NavLink;
    var __moduleName = context_8 && context_8.id;
    return {
        setters: [
            function (io_1_1) {
                io_1 = io_1_1;
            },
            function (loader_3_1) {
                loader_3 = loader_3_1;
            },
            function (page_2_1) {
                page_2 = page_2_1;
            }
        ],
        execute: function () {
            exports_8("navLinkName", navLinkName = "ap-nav-link");
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
                        this.foundPage = page_2.FindPage(loader_3.globals.pageDirectory, pageName);
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
System.register("custom-elements/ap-dir-display", ["io", "custom-elements/ap-nav-link"], function (exports_9, context_9) {
    "use strict";
    var io_2, ap_nav_link_1, dirDisplayName, DirectoryDisplay;
    var __moduleName = context_9 && context_9.id;
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
            exports_9("dirDisplayName", dirDisplayName = "ap-dir-display");
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
System.register("custom-elements/ap-auth-container", ["auth-manager"], function (exports_10, context_10) {
    "use strict";
    var auth_manager_1, authContainerName, AuthDisplayType, universalAuthorization, AuthContainer;
    var __moduleName = context_10 && context_10.id;
    return {
        setters: [
            function (auth_manager_1_1) {
                auth_manager_1 = auth_manager_1_1;
            }
        ],
        execute: function () {
            exports_10("authContainerName", authContainerName = "ap-auth-container");
            (function (AuthDisplayType) {
                AuthDisplayType["block"] = "block";
                AuthDisplayType["inline"] = "inline";
                AuthDisplayType["inlineBlock"] = "inline-block";
                AuthDisplayType["none"] = "none";
            })(AuthDisplayType || (AuthDisplayType = {}));
            exports_10("AuthDisplayType", AuthDisplayType);
            universalAuthorization = "gm";
            AuthContainer = class AuthContainer extends HTMLElement {
                constructor() {
                    super();
                    this.accessTokens = [];
                    this.rendered = false;
                }
                get displayType() {
                    if (this.hasAttribute(AuthDisplayType.block)) {
                        return AuthDisplayType.block;
                    }
                    else if (this.hasAttribute(AuthDisplayType.inline)) {
                        return AuthDisplayType.inline;
                    }
                    else if (this.hasAttribute(AuthDisplayType.inlineBlock)) {
                        return AuthDisplayType.inlineBlock;
                    }
                    else if (this.hasAttribute(AuthDisplayType.none)) {
                        return AuthDisplayType.none;
                    }
                    else {
                        this.setAttribute(AuthDisplayType.block, "");
                        return AuthDisplayType.block;
                    }
                }
                set displayType(val) {
                    switch (val) {
                        case AuthDisplayType.block:
                            this.setAttribute(AuthDisplayType.block, "");
                            this.removeAttribute(AuthDisplayType.inline);
                            this.removeAttribute(AuthDisplayType.inlineBlock);
                            this.removeAttribute(AuthDisplayType.none);
                            break;
                        case AuthDisplayType.inline:
                            this.removeAttribute(AuthDisplayType.block);
                            this.setAttribute(AuthDisplayType.inline, "");
                            this.removeAttribute(AuthDisplayType.inlineBlock);
                            this.removeAttribute(AuthDisplayType.none);
                            break;
                        case AuthDisplayType.inlineBlock:
                            this.removeAttribute(AuthDisplayType.block);
                            this.removeAttribute(AuthDisplayType.inline);
                            this.setAttribute(AuthDisplayType.inlineBlock, "");
                            this.removeAttribute(AuthDisplayType.none);
                            break;
                        case AuthDisplayType.none:
                            this.removeAttribute(AuthDisplayType.block);
                            this.removeAttribute(AuthDisplayType.inline);
                            this.removeAttribute(AuthDisplayType.inlineBlock);
                            this.setAttribute(AuthDisplayType.none, "");
                            break;
                    }
                }
                connectedCallback() {
                    this.rendered = true;
                    const accessTokenString = this.getAttribute("permissions");
                    if (accessTokenString) {
                        this.accessTokens = accessTokenString.split(" ");
                    }
                    else {
                        this.accessTokens = [];
                    }
                    this.callbackId = auth_manager_1.AuthManager.userChanged.AddCallback((user) => {
                        this.currentUser = user;
                        if (this.rendered) {
                            this.render();
                        }
                    }, true);
                }
                disconnectedCallback() {
                    this.rendered = false;
                    auth_manager_1.AuthManager.userChanged.RemoveCallback(this.callbackId);
                }
                render() {
                    let hasPermissions = false;
                    if (this.currentUser) {
                        hasPermissions = this.currentUser.accessTokens.some((token) => token === universalAuthorization || this.accessTokens.includes(token));
                    }
                    if (hasPermissions) {
                        this.style.display = this.displayType;
                    }
                    else {
                        this.style.display = AuthDisplayType.none;
                    }
                }
            };
            customElements.define(authContainerName, AuthContainer);
        }
    };
});
System.register("custom-elements/ap-auth-display", ["auth-manager"], function (exports_11, context_11) {
    "use strict";
    var auth_manager_2, authDisplayName, AuthDisplay;
    var __moduleName = context_11 && context_11.id;
    return {
        setters: [
            function (auth_manager_2_1) {
                auth_manager_2 = auth_manager_2_1;
            }
        ],
        execute: function () {
            exports_11("authDisplayName", authDisplayName = "ap-auth-display");
            AuthDisplay = class AuthDisplay extends HTMLElement {
                constructor() {
                    super();
                    this.rendered = false;
                }
                connectedCallback() {
                    this.rendered = true;
                    this.callbackId = auth_manager_2.AuthManager.userChanged.AddCallback((user) => {
                        this.currentUser = user;
                        if (this.rendered) {
                            this.render();
                        }
                    }, true);
                }
                disconnectedCallback() {
                    this.rendered = false;
                    auth_manager_2.AuthManager.userChanged.RemoveCallback(this.callbackId);
                }
                render() {
                    this.innerHTML = "";
                    const upperContainer = document.createElement("div");
                    upperContainer.classList.add("auth-display-container", "auth-display-upper-container");
                    const lowerContainer = document.createElement("div");
                    lowerContainer.classList.add("auth-display-container", "auth-display-lower-container");
                    if (this.currentUser) {
                        this.renderAuthorized(upperContainer, lowerContainer);
                    }
                    else {
                        this.renderUnauthorized(upperContainer, lowerContainer);
                    }
                    this.appendChild(upperContainer);
                    this.appendChild(lowerContainer);
                }
                renderAuthorized(upperContainer, lowerContainer) {
                    const span = document.createElement("span");
                    span.classList.add("auth-display-authorized-text");
                    span.innerText = `Hello, ${this.currentUser.name}!`;
                    upperContainer.appendChild(span);
                    const deauthButton = document.createElement("button");
                    deauthButton.innerText = "Deauthorize";
                    deauthButton.classList.add("auth-display-deauth-button");
                    deauthButton.onclick = () => {
                        auth_manager_2.AuthManager.deauthorize();
                    };
                    lowerContainer.appendChild(deauthButton);
                }
                renderUnauthorized(upperContainer, lowerContainer) {
                    const label = document.createElement("label");
                    label.innerText = "Authorization Passcode:";
                    label.htmlFor = "auth-display-input";
                    label.classList.add("auth-display-label");
                    upperContainer.appendChild(label);
                    const input = document.createElement("input");
                    input.id = "auth-display-input";
                    upperContainer.appendChild(input);
                    const authButton = document.createElement("button");
                    authButton.innerText = "Authorize";
                    authButton.classList.add("auth-display-auth-button");
                    authButton.onclick = () => {
                        auth_manager_2.AuthManager.authorize(input.value);
                    };
                    lowerContainer.appendChild(authButton);
                }
            };
            customElements.define(authDisplayName, AuthDisplay);
        }
    };
});
System.register("custom-elements/ap-stat-block", ["utilities"], function (exports_12, context_12) {
    "use strict";
    var utilities_2, statBlockName, SubElementNames, StatBlock;
    var __moduleName = context_12 && context_12.id;
    return {
        setters: [
            function (utilities_2_1) {
                utilities_2 = utilities_2_1;
            }
        ],
        execute: function () {
            exports_12("statBlockName", statBlockName = "ap-stat-block");
            (function (SubElementNames) {
                SubElementNames["hitDice"] = "hit-dice";
                SubElementNames["armorClass"] = "armor-class";
                SubElementNames["attacks"] = "attacks";
                SubElementNames["skillBonus"] = "skill-bonus";
                SubElementNames["savingThrow"] = "saving-throw";
                SubElementNames["movement"] = "movement";
                SubElementNames["morale"] = "morale";
                SubElementNames["numberAppearing"] = "number-appearing";
            })(SubElementNames || (SubElementNames = {}));
            StatBlock = class StatBlock extends HTMLElement {
                constructor() {
                    super();
                }
                connectedCallback() {
                    if (!this.shadowRoot) {
                        this.attachShadow({ mode: "open" });
                        this.shadowRoot.appendChild(utilities_2.buildCssStylesheetElement("elements", true, true));
                        this.container = document.createElement("div");
                        this.container.classList.add("stat-block-container");
                        this.shadowRoot.appendChild(this.container);
                    }
                    this.container.innerHTML = "";
                    const values = this.getValues();
                    const table = document.createElement("table");
                    table.appendChild(this.buildRow("Armor Class", values.armorClass, "No. Appearing", values.numberAppearing));
                    table.appendChild(this.buildRow("Hit Dice", values.hitDice, "Saving Throw", values.savingThrow));
                    table.appendChild(this.buildRow("Attack", values.attacks, "Movement", values.movement));
                    table.appendChild(this.buildRow("Skill Bonus", values.skillBonus, "Morale", values.morale));
                    this.container.appendChild(table);
                }
                getValues() {
                    const hitDiceElement = this.querySelector(SubElementNames.hitDice);
                    const armorClassElement = this.querySelector(SubElementNames.armorClass);
                    const attacksElement = this.querySelector(SubElementNames.attacks);
                    const skillBonusElement = this.querySelector(SubElementNames.skillBonus);
                    const savingThrowElement = this.querySelector(SubElementNames.savingThrow);
                    const movementElement = this.querySelector(SubElementNames.movement);
                    const moraleElement = this.querySelector(SubElementNames.morale);
                    const numberAppearingElement = this.querySelector(SubElementNames.numberAppearing);
                    return {
                        hitDice: hitDiceElement ? hitDiceElement.innerHTML : "",
                        armorClass: armorClassElement ? armorClassElement.innerHTML : "",
                        attacks: attacksElement ? attacksElement.innerHTML : "",
                        skillBonus: skillBonusElement ? skillBonusElement.innerHTML : "",
                        savingThrow: savingThrowElement ? savingThrowElement.innerHTML : "",
                        movement: movementElement ? movementElement.innerHTML : "",
                        morale: moraleElement ? moraleElement.innerHTML : "",
                        numberAppearing: numberAppearingElement ? numberAppearingElement.innerHTML : "",
                    };
                }
                buildRow(column1Name, column1Value, column2Name, column2Value) {
                    const row = document.createElement("tr");
                    let header;
                    let value;
                    header = document.createElement("th");
                    header.innerText = column1Name;
                    row.appendChild(header);
                    value = document.createElement("td");
                    value.innerHTML = column1Value;
                    row.appendChild(value);
                    header = document.createElement("th");
                    header.innerText = column2Name;
                    row.appendChild(header);
                    value = document.createElement("td");
                    value.innerHTML = column2Value;
                    row.appendChild(value);
                    return row;
                }
            };
            customElements.define(statBlockName, StatBlock);
        }
    };
});
System.register("custom-elements/custom-elements", ["custom-elements/ap-nav-link", "custom-elements/ap-dir-display", "custom-elements/ap-auth-container", "custom-elements/ap-auth-display", "custom-elements/ap-stat-block"], function (exports_13, context_13) {
    "use strict";
    var __moduleName = context_13 && context_13.id;
    return {
        setters: [
            function (_1) {
            },
            function (_2) {
            },
            function (_3) {
            },
            function (_4) {
            },
            function (_5) {
            }
        ],
        execute: function () {
        }
    };
});
System.register("main", ["custom-elements/custom-elements", "io", "loader", "types/page"], function (exports_14, context_14) {
    "use strict";
    var io_3, loader_4, page_3;
    var __moduleName = context_14 && context_14.id;
    return {
        setters: [
            function (_6) {
            },
            function (io_3_1) {
                io_3 = io_3_1;
            },
            function (loader_4_1) {
                loader_4 = loader_4_1;
            },
            function (page_3_1) {
                page_3 = page_3_1;
            }
        ],
        execute: function () {
            window.test = (name) => {
                console.log(page_3.FindPage(loader_4.globals.pageDirectory, name));
            };
            io_3.InitialLoad().then(() => {
                onpopstate = io_3.OnPopState;
            });
        }
    };
});
