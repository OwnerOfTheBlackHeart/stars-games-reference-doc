System.register("callback-event", [], function (exports_1, context_1) {
    "use strict";
    var highestId, CallbackManager;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            highestId = 0;
            CallbackManager = class CallbackManager {
                constructor(isUndefinedValid = false, isFirstRunRequired = false, initialValue) {
                    this.callbacks = [];
                    this.singleRunCallbacks = [];
                    this.hasRan = false;
                    this.isUndefinedValid = false;
                    this.isFirstRunRequired = false;
                    this.isUndefinedValid = isUndefinedValid;
                    this.isFirstRunRequired = isFirstRunRequired;
                    this.previousValue = initialValue;
                }
                AddCallback(callback, runImmediately = false) {
                    const id = highestId++;
                    this.callbacks.push({ func: callback, id });
                    if (runImmediately && (this.isUndefinedValid || this.previousValue !== undefined) && (!this.isFirstRunRequired || this.hasRan)) {
                        callback(this.previousValue, this.previousValue);
                    }
                    return id;
                }
                AddSingleRunCallback(callback, runImmediately = false) {
                    if (runImmediately && (this.isUndefinedValid || this.previousValue !== undefined) && (!this.isFirstRunRequired || this.hasRan)) {
                        callback(this.previousValue, this.previousValue);
                    }
                    else {
                        this.singleRunCallbacks.push({ func: callback, id: 0 });
                    }
                }
                RemoveCallback(callbackId) {
                    this.callbacks = this.callbacks.filter((callback) => callback.id !== callbackId);
                    return callbackId;
                }
                RunCallbacks(newValue) {
                    this.hasRan = true;
                    this.callbacks.forEach((callback) => callback.func(newValue, this.previousValue));
                    this.singleRunCallbacks.forEach((callback) => callback.func(newValue, this.previousValue));
                    this.singleRunCallbacks = [];
                    this.previousValue = newValue;
                }
                GetCurrentValue() {
                    return Object.freeze(this.previousValue);
                }
            };
            exports_1("CallbackManager", CallbackManager);
        }
    };
});
System.register("types/auth-user", [], function (exports_2, context_2) {
    "use strict";
    var AuthUser, universalAuthorization;
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [],
        execute: function () {
            AuthUser = class AuthUser {
            };
            exports_2("AuthUser", AuthUser);
            exports_2("universalAuthorization", universalAuthorization = "gm");
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
            if (page.theme) {
                foundPage.theme = page.theme;
            }
        }
        else {
            if (!directory.directories) {
                return undefined;
            }
            const foundDirectory = directory.directories.find((childDir) => {
                foundPage = FindPageInner(childDir, pageName, currentPath + "/" + childDir.baseUrl);
                return foundPage && foundPage.page;
            });
        }
        if (foundPage) {
            foundPage.parents.unshift({ ...mainPage, url: mainPage.external ? mainPage.url : currentPath + "/" + mainPage.url });
            if (!foundPage.theme) {
                foundPage.theme = directory.theme;
            }
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
System.register("types/time", [], function (exports_4, context_4) {
    "use strict";
    var Time, Season, Month, TimeRef;
    var __moduleName = context_4 && context_4.id;
    return {
        setters: [],
        execute: function () {
            Time = class Time {
                constructor(day, month, year) {
                    if (day != undefined) {
                        this.day = day;
                    }
                    else {
                        this.day = 0;
                    }
                    if (month != undefined) {
                        this.month = month;
                    }
                    else {
                        this.month = 0;
                    }
                    if (year != undefined) {
                        this.year = year;
                    }
                    else {
                        this.year = 0;
                    }
                }
                toString(doesIncludeSeason = false) {
                    let toReturn = "";
                    let tempTime = this.DistributeDays();
                    let month = TimeRef.months[tempTime.month];
                    let numeralAbbreviation = " ";
                    if ([10, 11, 12].some((day) => day === tempTime.day)) {
                        numeralAbbreviation = "th";
                    }
                    else {
                        switch (tempTime.day % 10) {
                            case 0:
                                numeralAbbreviation = "st";
                                break;
                            case 1:
                                numeralAbbreviation = "nd";
                                break;
                            case 2:
                                numeralAbbreviation = "rd";
                                break;
                            default:
                                numeralAbbreviation = "th";
                        }
                    }
                    toReturn += month.name + " ";
                    toReturn += tempTime.day + 1 + numeralAbbreviation + ", ";
                    toReturn += tempTime.year;
                    if (doesIncludeSeason) {
                        toReturn += ": " + month.season;
                    }
                    return toReturn;
                }
                Add(time2) {
                    return Time.Add(this, time2);
                }
                Subtract(time2) {
                    return Time.Subtract(this, time2);
                }
                ToDays() {
                    return Time.ToDays(this);
                }
                DistributeDays() {
                    let tempTime = new Time();
                    let days = this.ToDays();
                    let multiplier = 0;
                    multiplier = Time.YearsToDays(1);
                    tempTime.year = Math.floor(days / multiplier);
                    days -= multiplier * tempTime.year;
                    multiplier = Time.MonthsToDays(1);
                    tempTime.month = Math.floor(days / multiplier);
                    days -= multiplier * tempTime.month;
                    tempTime.day = days;
                    return tempTime;
                }
                Compare(b) {
                    if (!b) {
                        return 1;
                    }
                    if (this.year === b.year) {
                        if (this.month === b.month) {
                            if (this.day === b.day) {
                                return 0;
                            }
                            else {
                                return this.day - b.day;
                            }
                        }
                        else {
                            return this.month - b.month;
                        }
                    }
                    else {
                        return this.year - b.year;
                    }
                }
                static FromInitializer(initializer) {
                    return new Time(initializer.day, initializer.month, initializer.year);
                }
                static Add(time1, time2) {
                    let toReturn = new Time();
                    toReturn.day = time1.ToDays() + time2.ToDays();
                    toReturn = toReturn.DistributeDays();
                    return toReturn;
                }
                static Subtract(time1, time2) {
                    let toReturn = new Time();
                    toReturn.day = time1.ToDays() - time2.ToDays();
                    toReturn = toReturn.DistributeDays();
                    return toReturn;
                }
                static ToDays(time) {
                    let tempTime = Time.CleanTime(time);
                    let toReturn = tempTime.day;
                    toReturn += Time.YearsToDays(tempTime.year);
                    toReturn += Time.MonthsToDays(tempTime.month);
                    return toReturn;
                }
                static BuildDiffString(currentTime, toDiffTime) {
                    if (!currentTime || !toDiffTime) {
                        return undefined;
                    }
                    let offset;
                    let daysDifference = currentTime.ToDays() - toDiffTime.ToDays();
                    let toReturn = "";
                    if (daysDifference > 0) {
                        offset = currentTime.Subtract(toDiffTime).DistributeDays();
                    }
                    else if (daysDifference < 0) {
                        offset = toDiffTime.Subtract(currentTime).DistributeDays();
                    }
                    else {
                        return "Current date";
                    }
                    if (offset.year > 0) {
                        toReturn += offset.year.toString() + (offset.year > 1 ? " years" : " year");
                    }
                    if (offset.month > 0) {
                        if (toReturn.length > 0) {
                            toReturn += ", ";
                        }
                        toReturn += offset.month.toString() + (offset.month > 1 ? " months" : " month");
                    }
                    if (offset.day > 0) {
                        if (toReturn.length > 0) {
                            toReturn += " and ";
                        }
                        toReturn += offset.day.toString() + (offset.day > 1 ? " days" : " day");
                    }
                    if (daysDifference > 0) {
                        toReturn += " ago";
                    }
                    else if (daysDifference < 0) {
                        toReturn += " from now";
                    }
                    return toReturn;
                }
                static WeeksToDays(weeks) {
                    return weeks * TimeRef.daysPerWeek;
                }
                static MonthsToDays(months) {
                    return Time.WeeksToDays(months * TimeRef.weeksPerMonth);
                }
                static YearsToMonths(years) {
                    return years * TimeRef.monthsPerYear;
                }
                static YearsToDays(years) {
                    return Time.MonthsToDays(Time.YearsToMonths(years));
                }
                static CleanTime(time) {
                    return time;
                }
                static Compare(a, b) {
                    if (a === b) {
                        return 0;
                    }
                    else if (a && !b) {
                        return 1;
                    }
                    else if (!a && b) {
                        return -1;
                    }
                    else {
                        return a.Compare(b);
                    }
                }
            };
            exports_4("Time", Time);
            (function (Season) {
                Season["Summer"] = "summer";
                Season["Spring"] = "spring";
                Season["Fall"] = "fall";
                Season["Winter"] = "winter";
            })(Season || (Season = {}));
            exports_4("Season", Season);
            Month = class Month {
                constructor(name, position, season) {
                    this.name = name;
                    this.position = position;
                    this.season = season;
                }
            };
            exports_4("Month", Month);
            Month.January = new Month("January", 0, Season.Winter);
            Month.February = new Month("February", 1, Season.Winter);
            Month.March = new Month("March", 2, Season.Spring);
            Month.April = new Month("April", 3, Season.Spring);
            Month.May = new Month("May", 4, Season.Spring);
            Month.June = new Month("June", 5, Season.Summer);
            Month.July = new Month("July", 6, Season.Summer);
            Month.August = new Month("August", 7, Season.Summer);
            Month.September = new Month("September", 8, Season.Fall);
            Month.October = new Month("October", 9, Season.Fall);
            Month.November = new Month("November", 10, Season.Fall);
            Month.December = new Month("December", 11, Season.Winter);
            TimeRef = class TimeRef {
            };
            exports_4("TimeRef", TimeRef);
            TimeRef.daysPerWeek = 7;
            TimeRef.weeksPerMonth = 4;
            TimeRef.monthsPerYear = 12;
            TimeRef.months = [
                Month.January,
                Month.February,
                Month.March,
                Month.April,
                Month.May,
                Month.June,
                Month.July,
                Month.August,
                Month.September,
                Month.October,
                Month.November,
                Month.December,
            ];
        }
    };
});
System.register("loader", ["callback-event", "types/time"], function (exports_5, context_5) {
    "use strict";
    var callback_event_1, time_1, globalsReady, _a, directory, users, dates, templateLocations, globals;
    var __moduleName = context_5 && context_5.id;
    function activateDates(dates) {
        const activatedDates = {};
        for (const key in dates) {
            activatedDates[key] = time_1.Time.FromInitializer(dates[key]);
        }
        return activatedDates;
    }
    return {
        setters: [
            function (callback_event_1_1) {
                callback_event_1 = callback_event_1_1;
            },
            function (time_1_1) {
                time_1 = time_1_1;
            }
        ],
        execute: async function () {
            exports_5("globalsReady", globalsReady = new callback_event_1.CallbackManager(true, true));
            _a = await Promise.all([
                fetch("data/pages.json", { cache: "no-store" }).then((response) => response.json()),
                fetch("data/auth.json", { cache: "no-store" }).then((response) => response.json()),
                fetch("data/dates.json", { cache: "no-store" }).then((response) => response.json()),
                fetch("data/templates.json", { cache: "no-store" }).then((response) => response.json()),
            ]), directory = _a[0], users = _a[1], dates = _a[2], templateLocations = _a[3];
            exports_5("globals", globals = {
                pageDirectory: directory,
                users: users,
                dates: activateDates(dates),
                templateLocations,
            });
            globalsReady.RunCallbacks();
        }
    };
});
System.register("auth-manager", ["callback-event", "loader", "types/auth-user"], function (exports_6, context_6) {
    "use strict";
    var callback_event_2, loader_1, auth_user_1, currentNameToken, AuthManager;
    var __moduleName = context_6 && context_6.id;
    return {
        setters: [
            function (callback_event_2_1) {
                callback_event_2 = callback_event_2_1;
            },
            function (loader_1_1) {
                loader_1 = loader_1_1;
            },
            function (auth_user_1_1) {
                auth_user_1 = auth_user_1_1;
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
                static checkUserPermissions(user, permissions) {
                    if (user) {
                        return user.accessTokens.some((token) => token === auth_user_1.universalAuthorization || permissions.includes(token));
                    }
                    else {
                        return false;
                    }
                }
                static checkCurrentUserPermissions(permissions) {
                    return this.checkUserPermissions(this.userChanged.GetCurrentValue(), permissions);
                }
                static saveUser(user) {
                    this.userChanged.RunCallbacks(user);
                    localStorage.setItem(currentNameToken, user ? user.name : "");
                }
            };
            exports_6("AuthManager", AuthManager);
            AuthManager.userChanged = new callback_event_2.CallbackManager(true, true);
            loader_1.globalsReady.AddCallback(() => AuthManager.checkStoredUser(), true);
        }
    };
});
System.register("themes", ["callback-event", "io"], function (exports_7, context_7) {
    "use strict";
    var callback_event_3, io_1, Theme, defaultTheme, CurrentTheme;
    var __moduleName = context_7 && context_7.id;
    return {
        setters: [
            function (callback_event_3_1) {
                callback_event_3 = callback_event_3_1;
            },
            function (io_1_1) {
                io_1 = io_1_1;
            }
        ],
        execute: function () {
            (function (Theme) {
                Theme["stars"] = "theme-stars";
                Theme["worlds"] = "theme-worlds";
                Theme["test"] = "theme-test";
            })(Theme || (Theme = {}));
            exports_7("Theme", Theme);
            exports_7("defaultTheme", defaultTheme = Theme.stars);
            exports_7("CurrentTheme", CurrentTheme = new callback_event_3.CallbackManager(false, false, defaultTheme));
            CurrentTheme.AddCallback((theme, previous) => {
                const classList = document?.body?.classList;
                if (classList) {
                    if (classList.contains(previous)) {
                        classList.replace(previous, theme);
                    }
                    else {
                        classList.add(theme);
                    }
                }
            });
            io_1.pageChangeManager.AddCallback((foundPage) => {
                if (foundPage?.theme) {
                    CurrentTheme.RunCallbacks(foundPage.theme);
                }
                else {
                    CurrentTheme.RunCallbacks(defaultTheme);
                }
            }, true);
        }
    };
});
System.register("custom-elements/ap-theme-container", ["themes"], function (exports_8, context_8) {
    "use strict";
    var themes_1, ThemeContainer;
    var __moduleName = context_8 && context_8.id;
    return {
        setters: [
            function (themes_1_1) {
                themes_1 = themes_1_1;
            }
        ],
        execute: function () {
            ThemeContainer = class ThemeContainer extends HTMLElement {
                constructor() {
                    super();
                }
                get full() {
                    return this.hasAttribute(ThemeContainer.fullKey);
                }
                set full(val) {
                    if (val) {
                        this.setAttribute(ThemeContainer.fullKey, "");
                    }
                    else {
                        this.removeAttribute(ThemeContainer.fullKey);
                    }
                }
                connectedCallback() {
                    if (this.full) {
                        this.style.width = "100%";
                        this.style.height = "100%";
                    }
                    else {
                        this.style.width = undefined;
                        this.style.height = undefined;
                    }
                    this.callbackId = themes_1.CurrentTheme.AddCallback((theme, previous) => {
                        if (this.classList.contains(previous)) {
                            this.classList.replace(previous, theme);
                        }
                        else {
                            this.classList.add(theme);
                        }
                    }, true);
                }
                disconnectedCallback() {
                    themes_1.CurrentTheme.RemoveCallback(this.callbackId);
                }
            };
            exports_8("ThemeContainer", ThemeContainer);
            ThemeContainer.fullKey = "full";
            customElements.define("ap-theme-container", ThemeContainer);
        }
    };
});
System.register("custom-elements/themed-element", [], function (exports_9, context_9) {
    "use strict";
    var ThemedElement;
    var __moduleName = context_9 && context_9.id;
    return {
        setters: [],
        execute: function () {
            ThemedElement = class ThemedElement extends HTMLElement {
                constructor() {
                    super();
                }
            };
            exports_9("ThemedElement", ThemedElement);
        }
    };
});
System.register("utilities", [], function (exports_10, context_10) {
    "use strict";
    var __moduleName = context_10 && context_10.id;
    function IsGoodString(str) {
        return str !== undefined && str !== "";
    }
    exports_10("IsGoodString", IsGoodString);
    function CreateTableHeader(data, className) {
        let header = document.createElement("th");
        header.innerHTML = data;
        if (IsGoodString(className)) {
            header.className = className;
        }
        return header;
    }
    exports_10("CreateTableHeader", CreateTableHeader);
    function CreateTableData(data, className) {
        let dataElement = document.createElement("td");
        dataElement.innerHTML = data;
        if (IsGoodString(className)) {
            dataElement.className = className;
        }
        return dataElement;
    }
    exports_10("CreateTableData", CreateTableData);
    function showElement(element, scrolledTo) {
        if (element && scrolledTo) {
            element.scrollTop = scrolledTo.offsetTop - element.offsetTop;
            element.scrollLeft = scrolledTo.offsetLeft - element.offsetLeft;
        }
    }
    exports_10("showElement", showElement);
    function showId(parentId, childId) {
        const parent = document.getElementById(parentId);
        const child = document.getElementById(childId);
        showElement(parent, child);
    }
    exports_10("showId", showId);
    function buildCssStylesheetElement(path, addDotCss = true, addOutPath = false) {
        const href = `${addOutPath ? "out/styles/" : ""}${path}${addDotCss ? ".css" : ""}`;
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.type = "text/css";
        link.setAttribute("href", href);
        return link;
    }
    exports_10("buildCssStylesheetElement", buildCssStylesheetElement);
    function numberWithCommas(x, places) {
        if (places === undefined) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        else {
            return x.toFixed(places).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    }
    exports_10("numberWithCommas", numberWithCommas);
    function getDescendantProperty(parent, childPath, defaultValue = undefined) {
        if (parent === undefined || parent === null || childPath === undefined || childPath === null) {
            return defaultValue;
        }
        else if (childPath === "") {
            return parent;
        }
        else {
            const pathSteps = childPath.split(".");
            if (!pathSteps || pathSteps.length === 0) {
                return parent;
            }
            const found = pathSteps.reduce((previousDescendant, childName) => {
                if (previousDescendant !== undefined) {
                    return previousDescendant[childName];
                }
                else {
                    return undefined;
                }
            }, parent);
            if (found === undefined) {
                return defaultValue;
            }
            else {
                return found;
            }
        }
    }
    exports_10("getDescendantProperty", getDescendantProperty);
    function setDescendantProperty(parent, childPath, newValue) {
        if (!childPath) {
            return parent;
        }
        const pathSteps = childPath.split(".");
        if (!pathSteps || pathSteps.length === 0) {
            return parent;
        }
        parent = (parent === undefined ? {} : parent);
        const maxIndex = pathSteps.length - 1;
        pathSteps.reduce((previousDescendant, childName, index) => {
            if (index === maxIndex) {
                previousDescendant[childName] = newValue;
                return previousDescendant[childName];
            }
            else {
                let next = previousDescendant[childName];
                if (next === undefined || next === null) {
                    next = previousDescendant[childName] = {};
                }
                return next;
            }
        }, parent);
        return parent;
    }
    exports_10("setDescendantProperty", setDescendantProperty);
    function InitializeThemedShadowRoot(element, containerClass) {
        if (!element.shadowRoot) {
            element.attachShadow({ mode: "open" });
            element.shadowRoot.appendChild(buildCssStylesheetElement("elements", true, true));
            element.container = document.createElement("ap-theme-container");
            element.container.classList.add(containerClass);
            element.shadowRoot.appendChild(element.container);
            return true;
        }
        else {
            return false;
        }
    }
    exports_10("InitializeThemedShadowRoot", InitializeThemedShadowRoot);
    return {
        setters: [],
        execute: function () {
            Array.prototype.firstElement = function () {
                return this[0];
            };
            Array.prototype.lastElement = function () {
                return this[this.length - 1];
            };
            String.prototype.replaceAll = function (searchValue, replaceValue) {
                return this.replace(new RegExp(searchValue, "g"), replaceValue);
            };
        }
    };
});
System.register("io", ["auth-manager", "callback-event", "loader", "types/page", "utilities"], function (exports_11, context_11) {
    "use strict";
    var auth_manager_1, callback_event_4, loader_2, page_1, utilities_1, headerQuery, footerQuery, contentQuery, headerPage, footerPage, defaultPage, titlePostface, loadedPage, Parameters, baseNavigateUrl, pageChangeManager, hashChangeManager;
    var __moduleName = context_11 && context_11.id;
    async function InitialLoad() {
        let pageName = GetActivePageName();
        loadedPage = pageName;
        const [header, footer, content] = await Promise.all([
            LoadIntoElement(headerPage, headerQuery),
            LoadIntoElement(footerPage, footerQuery),
            LoadIntoContent(pageName),
        ]);
        return { header, footer, content };
    }
    exports_11("InitialLoad", InitialLoad);
    function GetActivePageName() {
        const params = new URLSearchParams(location.search);
        let pageName = params.get(Parameters.pageName);
        pageName = pageName ? pageName : defaultPage;
        return pageName;
    }
    exports_11("GetActivePageName", GetActivePageName);
    function OnPopState(ev) {
        const pageName = GetActivePageName();
        if (pageName !== loadedPage) {
            loadedPage = pageName;
            LoadIntoContent(pageName);
        }
    }
    exports_11("OnPopState", OnPopState);
    function InternalNavigate(foundPage, hash) {
        let url = baseNavigateUrl + foundPage.page.name;
        if (hash) {
            url += hash;
        }
        history.pushState(undefined, foundPage.page.title + titlePostface, url);
        OnPopState({});
    }
    exports_11("InternalNavigate", InternalNavigate);
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
        pageChangeManager.RunCallbacks(foundPage);
        auth_manager_1.AuthManager.userChanged.AddSingleRunCallback(() => UpdateContentScroll(), true);
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
    exports_11("UpdateContentScroll", UpdateContentScroll);
    return {
        setters: [
            function (auth_manager_1_1) {
                auth_manager_1 = auth_manager_1_1;
            },
            function (callback_event_4_1) {
                callback_event_4 = callback_event_4_1;
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
            exports_11("Parameters", Parameters);
            exports_11("baseNavigateUrl", baseNavigateUrl = `index.html?${Parameters.pageName}=`);
            exports_11("pageChangeManager", pageChangeManager = new callback_event_4.CallbackManager());
            exports_11("hashChangeManager", hashChangeManager = new callback_event_4.CallbackManager());
            hashChangeManager.RunCallbacks(location.hash);
            addEventListener("hashchange", (event) => {
                hashChangeManager.RunCallbacks(location.hash);
            });
        }
    };
});
System.register("custom-elements/ap-nav-link", ["io", "loader", "types/page"], function (exports_12, context_12) {
    "use strict";
    var io_2, loader_3, page_2, navLinkName, NavLink;
    var __moduleName = context_12 && context_12.id;
    return {
        setters: [
            function (io_2_1) {
                io_2 = io_2_1;
            },
            function (loader_3_1) {
                loader_3 = loader_3_1;
            },
            function (page_2_1) {
                page_2 = page_2_1;
            }
        ],
        execute: function () {
            exports_12("navLinkName", navLinkName = "ap-nav-link");
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
                    let pageName = "";
                    if (!this.foundPage) {
                        const givenUrl = this.getAttribute("href");
                        if (givenUrl.includes("#")) {
                            [pageName, this.hash] = givenUrl.split("#");
                        }
                        else {
                            pageName = givenUrl;
                        }
                        this.foundPage = page_2.FindPage(loader_3.globals.pageDirectory, pageName);
                    }
                    let url = "";
                    try {
                        if (this.foundPage.page.external) {
                            url = this.foundPage.page.url;
                        }
                        else {
                            url = io_2.baseNavigateUrl + this.foundPage.page.name;
                        }
                    }
                    catch (e) {
                        console.log(`Failed to find page '${pageName}'`);
                    }
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
                        io_2.InternalNavigate(this.foundPage, this.hash);
                    }
                }
            };
            customElements.define(navLinkName, NavLink, { extends: "a" });
        }
    };
});
System.register("custom-elements/ap-dir-display", ["io", "custom-elements/ap-nav-link"], function (exports_13, context_13) {
    "use strict";
    var io_3, ap_nav_link_1, dirDisplayName, DirectoryDisplay;
    var __moduleName = context_13 && context_13.id;
    return {
        setters: [
            function (io_3_1) {
                io_3 = io_3_1;
            },
            function (ap_nav_link_1_1) {
                ap_nav_link_1 = ap_nav_link_1_1;
            }
        ],
        execute: function () {
            exports_13("dirDisplayName", dirDisplayName = "ap-dir-display");
            DirectoryDisplay = class DirectoryDisplay extends HTMLElement {
                constructor() {
                    super();
                    this.rendered = false;
                }
                connectedCallback() {
                    this.rendered = true;
                    this.callbackId = io_3.pageChangeManager.AddCallback((foundPage) => {
                        this.currentPage = foundPage;
                        if (this.rendered) {
                            this.render();
                        }
                    }, true);
                }
                disconnectedCallback() {
                    this.rendered = false;
                    io_3.pageChangeManager.RemoveCallback(this.callbackId);
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
System.register("custom-elements/ap-auth-container", ["auth-manager"], function (exports_14, context_14) {
    "use strict";
    var auth_manager_2, authContainerName, AuthDisplayType, AuthContainer;
    var __moduleName = context_14 && context_14.id;
    return {
        setters: [
            function (auth_manager_2_1) {
                auth_manager_2 = auth_manager_2_1;
            }
        ],
        execute: function () {
            exports_14("authContainerName", authContainerName = "ap-auth-container");
            (function (AuthDisplayType) {
                AuthDisplayType["block"] = "block";
                AuthDisplayType["inline"] = "inline";
                AuthDisplayType["inlineBlock"] = "inline-block";
                AuthDisplayType["none"] = "none";
            })(AuthDisplayType || (AuthDisplayType = {}));
            exports_14("AuthDisplayType", AuthDisplayType);
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
                    if (auth_manager_2.AuthManager.checkUserPermissions(this.currentUser, this.accessTokens)) {
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
System.register("custom-elements/ap-auth-display", ["auth-manager"], function (exports_15, context_15) {
    "use strict";
    var auth_manager_3, authDisplayName, AuthDisplay;
    var __moduleName = context_15 && context_15.id;
    return {
        setters: [
            function (auth_manager_3_1) {
                auth_manager_3 = auth_manager_3_1;
            }
        ],
        execute: function () {
            exports_15("authDisplayName", authDisplayName = "ap-auth-display");
            AuthDisplay = class AuthDisplay extends HTMLElement {
                constructor() {
                    super();
                    this.rendered = false;
                }
                connectedCallback() {
                    this.rendered = true;
                    this.callbackId = auth_manager_3.AuthManager.userChanged.AddCallback((user) => {
                        this.currentUser = user;
                        if (this.rendered) {
                            this.render();
                        }
                    }, true);
                }
                disconnectedCallback() {
                    this.rendered = false;
                    auth_manager_3.AuthManager.userChanged.RemoveCallback(this.callbackId);
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
                        auth_manager_3.AuthManager.deauthorize();
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
                        auth_manager_3.AuthManager.authorize(input.value);
                    };
                    lowerContainer.appendChild(authButton);
                }
            };
            customElements.define(authDisplayName, AuthDisplay);
        }
    };
});
System.register("custom-elements/ap-stat-block", ["utilities", "custom-elements/ap-theme-container", "custom-elements/themed-element"], function (exports_16, context_16) {
    "use strict";
    var utilities_2, themed_element_1, statBlockName, SubElementNames, StatBlock;
    var __moduleName = context_16 && context_16.id;
    return {
        setters: [
            function (utilities_2_1) {
                utilities_2 = utilities_2_1;
            },
            function (_1) {
            },
            function (themed_element_1_1) {
                themed_element_1 = themed_element_1_1;
            }
        ],
        execute: function () {
            exports_16("statBlockName", statBlockName = "ap-stat-block");
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
            StatBlock = class StatBlock extends themed_element_1.ThemedElement {
                constructor() {
                    super();
                }
                connectedCallback() {
                    utilities_2.InitializeThemedShadowRoot(this, "stat-block-container");
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
System.register("custom-elements/ap-timeline", ["auth-manager", "loader", "types/time", "utilities", "custom-elements/ap-theme-container", "custom-elements/themed-element"], function (exports_17, context_17) {
    "use strict";
    var auth_manager_4, loader_4, time_2, utilities_3, themed_element_2, TimeTable;
    var __moduleName = context_17 && context_17.id;
    return {
        setters: [
            function (auth_manager_4_1) {
                auth_manager_4 = auth_manager_4_1;
            },
            function (loader_4_1) {
                loader_4 = loader_4_1;
            },
            function (time_2_1) {
                time_2 = time_2_1;
            },
            function (utilities_3_1) {
                utilities_3 = utilities_3_1;
            },
            function (_2) {
            },
            function (themed_element_2_1) {
                themed_element_2 = themed_element_2_1;
            }
        ],
        execute: function () {
            TimeTable = class TimeTable extends themed_element_2.ThemedElement {
                constructor() {
                    super();
                    this.rows = [];
                    this.hasProcessedEntries = false;
                    this.rendered = false;
                }
                get headerTitle() {
                    return this.getAttribute("header");
                }
                set headerTitle(val) {
                    this.setAttribute("header", val);
                }
                get currentDateValue() {
                    return this.getAttribute("current-date-value");
                }
                set currentDateValue(val) {
                    this.setAttribute("current-date-value", val);
                }
                get disableSort() {
                    return this.hasAttribute("disable-sort");
                }
                set disableSort(val) {
                    if (val) {
                        this.setAttribute("disable-sort", "");
                    }
                    else {
                        this.removeAttribute("disable-sort");
                    }
                }
                connectedCallback() {
                    if (utilities_3.InitializeThemedShadowRoot(this, "time-table-container")) {
                        this.callbackId = auth_manager_4.AuthManager.userChanged.AddCallback((user) => {
                            this.currentUser = user;
                            if (this.rendered) {
                                this.render();
                            }
                        }, true);
                    }
                    this.render();
                }
                render() {
                    this.rendered = true;
                    this.container.innerHTML = "";
                    this.getEntries();
                    const table = document.createElement("table");
                    table.classList.add("alternating-colors");
                    if (this.headerTitle) {
                        table.appendChild(this.BuildHeaderRow(this.headerTitle));
                    }
                    for (let row of this.rows) {
                        table.appendChild(this.BuildNormalRow(row));
                    }
                    this.container.appendChild(table);
                }
                BuildHeaderRow(title) {
                    let node = document.createElement("tr");
                    let data = utilities_3.CreateTableHeader(title);
                    node.appendChild(data);
                    data.setAttribute("colspan", "3");
                    return node;
                }
                BuildNormalRow(dateRow) {
                    let node = document.createElement("tr");
                    if (this.currentDateValue) {
                        const diffString = time_2.Time.BuildDiffString(loader_4.globals.dates[this.currentDateValue], dateRow.time);
                        const dataNode = utilities_3.CreateTableData(diffString);
                        if (diffString.search("ago") >= 0) {
                            dataNode.classList.add("previous-date");
                        }
                        else if (diffString.search("from now") >= 0) {
                            dataNode.classList.add("future-date");
                        }
                        else {
                            dataNode.classList.add("current-date");
                        }
                        node.appendChild(dataNode);
                    }
                    node.appendChild(utilities_3.CreateTableData(dateRow.time.toString(false)));
                    if (dateRow.note != undefined) {
                        node.appendChild(utilities_3.CreateTableData(dateRow.note));
                    }
                    else {
                        node.appendChild(document.createElement("td"));
                    }
                    if (dateRow.permissions) {
                        node.classList.add("auth-row");
                        if (!auth_manager_4.AuthManager.checkUserPermissions(this.currentUser, dateRow.permissions)) {
                            node.style.display = "none";
                        }
                    }
                    return node;
                }
                getEntries() {
                    if (!this.hasProcessedEntries) {
                        this.hasProcessedEntries = true;
                        const entries = this.querySelectorAll("ap-time-entry");
                        entries.forEach((entry) => this.rows.push({
                            note: entry.innerHTML,
                            time: time_2.Time.FromInitializer({
                                day: Number(entry.getAttribute("day")),
                                month: Number(entry.getAttribute("month")),
                                year: Number(entry.getAttribute("year")),
                            }),
                            permissions: entry.getAttribute("permissions")?.split(" "),
                        }));
                        if (this.rows.length > 0) {
                            if (!this.disableSort) {
                                this.rows.sort((a, b) => time_2.Time.Compare(a.time, b.time));
                            }
                        }
                    }
                }
            };
            exports_17("TimeTable", TimeTable);
            loader_4.globalsReady.AddSingleRunCallback(() => {
                customElements.define("ap-time-table", TimeTable);
            }, true);
        }
    };
});
System.register("custom-elements/ap-display-global", ["loader", "utilities"], function (exports_18, context_18) {
    "use strict";
    var loader_js_1, utilities_js_1, DisplayGlobalElement;
    var __moduleName = context_18 && context_18.id;
    return {
        setters: [
            function (loader_js_1_1) {
                loader_js_1 = loader_js_1_1;
            },
            function (utilities_js_1_1) {
                utilities_js_1 = utilities_js_1_1;
            }
        ],
        execute: function () {
            DisplayGlobalElement = class DisplayGlobalElement extends HTMLElement {
                get propertyPath() {
                    return this.getAttribute("property-path");
                }
                set propertyPath(val) {
                    this.setAttribute("property-path", val);
                }
                constructor() {
                    super();
                }
                connectedCallback() {
                    this.Render();
                }
                Render() {
                    loader_js_1.globalsReady.AddSingleRunCallback(() => {
                        const value = utilities_js_1.getDescendantProperty(loader_js_1.globals, this.propertyPath, undefined);
                        if (value) {
                            this.innerHTML = value.toString();
                        }
                        else {
                            this.innerHTML = "";
                        }
                    }, true);
                }
            };
            customElements.define("ap-display-global", DisplayGlobalElement);
        }
    };
});
System.register("custom-elements/ap-birthday-generator", ["loader", "types/time", "utilities", "custom-elements/ap-theme-container", "custom-elements/themed-element"], function (exports_19, context_19) {
    "use strict";
    var loader_js_2, time_js_1, utilities_js_2, themed_element_js_1, instructions, BirthdayGeneratorElement;
    var __moduleName = context_19 && context_19.id;
    return {
        setters: [
            function (loader_js_2_1) {
                loader_js_2 = loader_js_2_1;
            },
            function (time_js_1_1) {
                time_js_1 = time_js_1_1;
            },
            function (utilities_js_2_1) {
                utilities_js_2 = utilities_js_2_1;
            },
            function (_3) {
            },
            function (themed_element_js_1_1) {
                themed_element_js_1 = themed_element_js_1_1;
            }
        ],
        execute: function () {
            instructions = Object.freeze(`
To generate a birthday, enter the character's age in the input below and click the 'Generate Birthday' button.
The birthday, along with how long ago it was, will be displayed directly below this sentence.
`);
            BirthdayGeneratorElement = class BirthdayGeneratorElement extends themed_element_js_1.ThemedElement {
                constructor() {
                    super();
                }
                get currentDateValue() {
                    return this.getAttribute("current-date-value");
                }
                set currentDateValue(val) {
                    this.setAttribute("current-date-value", val);
                }
                connectedCallback() {
                    this.Render();
                }
                Render() {
                    loader_js_2.globalsReady.AddSingleRunCallback(() => {
                        utilities_js_2.InitializeThemedShadowRoot(this, "birthday-generator-container");
                        this.container.innerHTML = "";
                        this.currentDate = utilities_js_2.getDescendantProperty(loader_js_2.globals, this.currentDateValue);
                        const bdayHeader = document.createElement("h4");
                        bdayHeader.textContent = "Generate Birthday";
                        bdayHeader.classList.add("birthday-header");
                        this.container.appendChild(bdayHeader);
                        const instructionsDisplay = document.createElement("p");
                        instructionsDisplay.textContent = instructions;
                        instructionsDisplay.classList.add("birthday-instructions");
                        this.container.appendChild(instructionsDisplay);
                        if (this.birthday) {
                            const bdayDisplay = document.createElement("p");
                            bdayDisplay.classList.add("birthday-display");
                            bdayDisplay.innerText = `You're birthday is ${this.birthday.toString()}. It was ${time_js_1.Time.BuildDiffString(this.currentDate, this.birthday)}.`;
                            this.container.appendChild(bdayDisplay);
                        }
                        const inputContainer = document.createElement("div");
                        inputContainer.classList.add("input-container");
                        this.container.appendChild(inputContainer);
                        this.ageInput = document.createElement("input");
                        this.ageInput.type = "number";
                        this.ageInput.classList.add("birthday-age-input");
                        this.ageInput.autocomplete = "off";
                        this.ageInput.setAttribute("data-form-type", "other");
                        if (this.age) {
                            this.ageInput.value = this.age.toString();
                        }
                        inputContainer.appendChild(this.ageInput);
                        const generateButton = document.createElement("button");
                        generateButton.textContent = "Generate Birthday";
                        generateButton.onclick = (event) => this.OnGenerateBirthdayClicked(event);
                        generateButton.classList.add("birthday-generate-button");
                        inputContainer.appendChild(generateButton);
                        const resetButton = document.createElement("button");
                        resetButton.textContent = "Reset Generator";
                        resetButton.onclick = (event) => {
                            this.age = 0;
                            this.birthday = undefined;
                            this.Render();
                        };
                        resetButton.classList.add("birthday-reset-button");
                        inputContainer.appendChild(resetButton);
                    }, true);
                }
                OnGenerateBirthdayClicked(event) {
                    const tempAge = this.ageInput.valueAsNumber;
                    if (tempAge) {
                        this.age = tempAge;
                    }
                    else {
                        alert("The selected age must be a non-zero number");
                        return;
                    }
                    this.birthday = this.GetRandomBirthday();
                    this.Render();
                }
                GetRandomBirthday() {
                    const month = Math.floor(Math.random() * 9);
                    const day = Math.floor(Math.random() * 28);
                    const year = this.currentDate.year - this.age;
                    const birthday = new time_js_1.Time(day, month, year);
                    if (!this.ValidateBirthday(birthday, this.currentDate, this.age)) {
                        if (birthday.year - this.age > 0) {
                            birthday.year = birthday.year - 1;
                        }
                        else {
                            birthday.year = birthday.year + 1;
                        }
                    }
                    return birthday;
                }
                ValidateBirthday(birthday, currentDate, age) {
                    return currentDate.Subtract(birthday).year === age;
                }
            };
            customElements.define("ap-birthday-generator", BirthdayGeneratorElement);
        }
    };
});
System.register("custom-elements/ap-vehicle-stat-block", ["utilities", "custom-elements/ap-theme-container", "custom-elements/themed-element"], function (exports_20, context_20) {
    "use strict";
    var utilities_4, themed_element_3, statBlockName, SubElementNames, VehicleStatBlock;
    var __moduleName = context_20 && context_20.id;
    return {
        setters: [
            function (utilities_4_1) {
                utilities_4 = utilities_4_1;
            },
            function (_4) {
            },
            function (themed_element_3_1) {
                themed_element_3 = themed_element_3_1;
            }
        ],
        execute: function () {
            exports_20("statBlockName", statBlockName = "ap-vehicle-stat-block");
            (function (SubElementNames) {
                SubElementNames["speed"] = "speed";
                SubElementNames["travelSpeed"] = "travel-speed";
                SubElementNames["armor"] = "armor";
                SubElementNames["power"] = "power";
                SubElementNames["hitPoints"] = "hit-points";
                SubElementNames["mass"] = "mass";
                SubElementNames["crew"] = "crew";
                SubElementNames["hardpoints"] = "hardpoints";
                SubElementNames["baseFrame"] = "base-frame";
                SubElementNames["fittings"] = "fittings";
            })(SubElementNames || (SubElementNames = {}));
            VehicleStatBlock = class VehicleStatBlock extends themed_element_3.ThemedElement {
                constructor() {
                    super();
                }
                connectedCallback() {
                    utilities_4.InitializeThemedShadowRoot(this, "stat-block-container");
                    this.container.innerHTML = "";
                    const values = this.getValues();
                    const table = document.createElement("table");
                    table.appendChild(this.buildRow("Speed", values.speed, "Km/H Travel", values.travelSpeed));
                    table.appendChild(this.buildRow("Armor", values.armor, "Power", values.power));
                    table.appendChild(this.buildRow("Hit Points", values.hitPoints, "Mass", values.mass));
                    table.appendChild(this.buildRow("Crew", values.crew, "Hardpoints", values.hardpoints));
                    table.appendChild(this.buildDoubleRow("Base Frame", values.baseFrame));
                    table.appendChild(this.buildDoubleRow("Fittings", values.fittings));
                    this.container.appendChild(table);
                }
                getValues() {
                    const speedElement = this.querySelector(SubElementNames.speed);
                    const travelSpeedElement = this.querySelector(SubElementNames.travelSpeed);
                    const armorElement = this.querySelector(SubElementNames.armor);
                    const powerElement = this.querySelector(SubElementNames.power);
                    const hitPointsElement = this.querySelector(SubElementNames.hitPoints);
                    const massElement = this.querySelector(SubElementNames.mass);
                    const crewElement = this.querySelector(SubElementNames.crew);
                    const hardpointsElement = this.querySelector(SubElementNames.hardpoints);
                    const baseFrameElement = this.querySelector(SubElementNames.baseFrame);
                    const fittingsElement = this.querySelector(SubElementNames.fittings);
                    return {
                        speed: speedElement ? speedElement.innerHTML : "",
                        travelSpeed: travelSpeedElement ? travelSpeedElement.innerHTML : "",
                        armor: armorElement ? armorElement.innerHTML : "",
                        power: powerElement ? powerElement.innerHTML : "",
                        hitPoints: hitPointsElement ? hitPointsElement.innerHTML : "",
                        mass: massElement ? massElement.innerHTML : "",
                        crew: crewElement ? crewElement.innerHTML : "",
                        hardpoints: hardpointsElement ? hardpointsElement.innerHTML : "",
                        baseFrame: baseFrameElement ? baseFrameElement.innerHTML : "",
                        fittings: fittingsElement ? fittingsElement.innerHTML : "",
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
                buildDoubleRow(name, value) {
                    const row = document.createElement("tr");
                    const header = document.createElement("th");
                    header.innerText = name;
                    row.appendChild(header);
                    const data = document.createElement("td");
                    data.innerHTML = value;
                    data.colSpan = 3;
                    row.appendChild(data);
                    return row;
                }
            };
            customElements.define(statBlockName, VehicleStatBlock);
        }
    };
});
System.register("custom-elements/ap-template-outlet", ["io", "loader"], function (exports_21, context_21) {
    "use strict";
    var io_4, loader_5, templateOutletName, TemplateOutlet;
    var __moduleName = context_21 && context_21.id;
    return {
        setters: [
            function (io_4_1) {
                io_4 = io_4_1;
            },
            function (loader_5_1) {
                loader_5 = loader_5_1;
            }
        ],
        execute: function () {
            exports_21("templateOutletName", templateOutletName = "ap-template-outlet");
            TemplateOutlet = class TemplateOutlet extends HTMLElement {
                get folder() {
                    return this.getAttribute("folder");
                }
                set folder(val) {
                    this.setAttribute("folder", val);
                }
                get path() {
                    return this.getAttribute("path");
                }
                set path(val) {
                    this.setAttribute("path", val);
                }
                get headerLevel() {
                    return Number(this.getAttribute("header-level"));
                }
                set headerLevel(val) {
                    this.setAttribute("header-level", val.toString());
                }
                constructor() {
                    super();
                }
                connectedCallback() {
                    this.innerHTML = "";
                    if (this.path && this.folder) {
                        const folderPath = loader_5.globals.templateLocations[this.folder];
                        const filepath = this.path.includes(".html") ? this.path : this.path + ".html";
                        if (folderPath) {
                            fetch(`${folderPath}/${filepath}`)
                                .then((response) => response.text())
                                .then((html) => {
                                this.innerHTML = this.adjustForHeaderLevel(html);
                                if (this.headerLevel) {
                                    const subTemplates = this.querySelectorAll(templateOutletName);
                                    if (subTemplates.length > 0) {
                                        subTemplates.forEach((subOutlet) => (subOutlet.headerLevel = subOutlet.headerLevel ? subOutlet.headerLevel + this.headerLevel - 1 : this.headerLevel));
                                    }
                                }
                                if (location.hash) {
                                    const element = this.querySelector(location.hash);
                                    if (element) {
                                        io_4.UpdateContentScroll();
                                    }
                                }
                            });
                        }
                    }
                }
                adjustForHeaderLevel(html) {
                    let headerLevelModifier = this.headerLevel;
                    if (headerLevelModifier) {
                        headerLevelModifier -= 1;
                        for (let i = 10; i >= 1; i--) {
                            html = html.replaceAll(`<h${i}`, `<h${i + headerLevelModifier}`).replaceAll(`</h${i}>`, `</h${i + headerLevelModifier}>`);
                        }
                        return html;
                    }
                    else {
                        return html;
                    }
                }
            };
            loader_5.globalsReady.AddSingleRunCallback(() => customElements.define(templateOutletName, TemplateOutlet));
        }
    };
});
System.register("custom-elements/ap-smart-table", ["utilities"], function (exports_22, context_22) {
    "use strict";
    var utilities_5, SmartTable;
    var __moduleName = context_22 && context_22.id;
    return {
        setters: [
            function (utilities_5_1) {
                utilities_5 = utilities_5_1;
            }
        ],
        execute: function () {
            SmartTable = class SmartTable extends HTMLElement {
                constructor() {
                    super();
                    this.columns = [];
                    this.entryNames = [];
                    this.rows = [];
                    this.entryClasses = {};
                }
                get headers() {
                    return this.getAttribute("headers");
                }
                set headers(val) {
                    this.setAttribute("headers", val);
                }
                connectedCallback() {
                    if (this.columns.length === 0) {
                        this.initialize();
                        console.log({
                            columns: this.columns,
                            entryNames: this.entryNames,
                            rows: this.rows,
                            footer: this.footer,
                        });
                    }
                    this.innerHTML = "";
                    const table = document.createElement("table");
                    table.classList.add("alternating-colors");
                    this.appendChild(table);
                    const headerRow = document.createElement("tr");
                    table.appendChild(headerRow);
                    this.columns.forEach((column) => headerRow.appendChild(utilities_5.CreateTableHeader(column)));
                    this.rows.forEach((row) => {
                        const dataRow = document.createElement("tr");
                        table.appendChild(dataRow);
                        this.entryNames.forEach((entryName) => dataRow.appendChild(utilities_5.CreateTableData(row[entryName], this.entryClasses[entryName])));
                    });
                    const footerRow = document.createElement("tr");
                    table.appendChild(footerRow);
                    const footerData = utilities_5.CreateTableData(this.footer, "smart-table-footer");
                    footerData.colSpan = this.columns.length;
                    footerRow.appendChild(footerData);
                }
                initialize() {
                    if (this.headers) {
                        this.columns = this.headers.split(",");
                        this.columns = this.columns.map((column) => column.trim());
                        this.entryNames = this.columns.map((column) => column
                            .toLowerCase()
                            .replaceAll(" ", "-")
                            .replaceAll(/['`"\\\/!@#$%%^&\*\(\)\[\]\{\};:.]/g, ""));
                    }
                    const elements = this.querySelectorAll(SmartTable.rowTagName);
                    elements.forEach((row) => {
                        const values = {};
                        this.entryNames.forEach((entryName) => (values[entryName] = row.querySelector(entryName)?.innerHTML ?? ""));
                        this.rows.push(values);
                    });
                    this.footer = this.querySelector(SmartTable.footerTagName)?.innerHTML;
                    const classesElement = this.querySelector(SmartTable.classesTagName);
                    this.entryClasses = this.entryNames.reduce((previous, entryName) => {
                        previous[entryName] = classesElement?.getAttribute(entryName) ?? "";
                        return previous;
                    }, {});
                }
            };
            exports_22("SmartTable", SmartTable);
            SmartTable.tagName = "ap-smart-table";
            SmartTable.rowTagName = "row";
            SmartTable.footerTagName = "footer";
            SmartTable.classesTagName = "classes";
            customElements.define(SmartTable.tagName, SmartTable);
        }
    };
});
System.register("custom-elements/ap-tab-container", ["io"], function (exports_23, context_23) {
    "use strict";
    var io_5, tabContainerName, tabElementName, tabNameAttribute, tabDisplayNameAttribute, tabDisplayClass, tabDisplayContainerClass, tabActiveClass, tabInactiveClass, TabContainer;
    var __moduleName = context_23 && context_23.id;
    return {
        setters: [
            function (io_5_1) {
                io_5 = io_5_1;
            }
        ],
        execute: function () {
            exports_23("tabContainerName", tabContainerName = "ap-tab-container");
            exports_23("tabElementName", tabElementName = "tab");
            exports_23("tabNameAttribute", tabNameAttribute = "name");
            exports_23("tabDisplayNameAttribute", tabDisplayNameAttribute = "displayname");
            exports_23("tabDisplayClass", tabDisplayClass = "tab-display");
            exports_23("tabDisplayContainerClass", tabDisplayContainerClass = "tab-display-container");
            exports_23("tabActiveClass", tabActiveClass = "active");
            exports_23("tabInactiveClass", tabInactiveClass = "inactive");
            TabContainer = class TabContainer extends HTMLElement {
                constructor() {
                    super();
                    this.tabs = {};
                    this.initialized = false;
                }
                connectedCallback() {
                    if (this.initialized) {
                        Object.keys(this.tabs).forEach((tabName) => {
                            if (!this.currentTab || this.currentTab === tabName) {
                                this.displayTab(tabName);
                            }
                            else {
                                this.hideTab(tabName);
                            }
                        });
                    }
                    else {
                        const tabsContainer = document.createElement("div");
                        tabsContainer.classList.add(tabDisplayContainerClass);
                        this.prepend(tabsContainer);
                        const tabElements = this.querySelectorAll(tabElementName);
                        tabElements.forEach((element) => {
                            const elementName = element.getAttribute(tabNameAttribute);
                            const displayName = element.getAttribute(tabDisplayNameAttribute) ?? elementName;
                            const tabDisplay = document.createElement("div");
                            tabDisplay.classList.add(tabDisplayClass);
                            tabDisplay.innerText = displayName;
                            tabDisplay.onclick = () => {
                                this.onTabClicked(elementName);
                            };
                            tabsContainer.appendChild(tabDisplay);
                            const tab = { tab: tabDisplay, contents: element };
                            tab.tab.classList.add(tabInactiveClass);
                            tab.contents.classList.add(tabInactiveClass);
                            this.tabs[elementName] = tab;
                            if (!this.currentTab || this.currentTab === elementName) {
                                this.currentTab = elementName;
                                this.displayTab(elementName);
                            }
                            else {
                                this.hideTab(elementName);
                            }
                        });
                        this.initialized = true;
                        this.callbackId = io_5.hashChangeManager.AddCallback((hash) => this.navigateToHash(hash), true);
                    }
                }
                disconnectedCallback() {
                    this.currentTab = undefined;
                    if (this.callbackId !== undefined) {
                        io_5.hashChangeManager.RemoveCallback(this.callbackId);
                        this.callbackId = undefined;
                    }
                }
                onTabClicked(newTab) {
                    if (newTab !== this.currentTab) {
                        Object.keys(this.tabs).forEach((tabName) => {
                            this.hideTab(tabName);
                        });
                        this.displayTab(newTab);
                    }
                }
                hideTab(tabName) {
                    const tab = this.tabs[tabName];
                    if (tab) {
                        tab.tab.classList.replace(tabActiveClass, tabInactiveClass);
                        tab.contents.classList.replace(tabActiveClass, tabInactiveClass);
                    }
                    else {
                        console.log(`Cannot hide tab. No tab ${tabName} exists`);
                    }
                }
                displayTab(tabName) {
                    const tab = this.tabs[tabName];
                    if (tab) {
                        this.currentTab = tabName;
                        tab.tab.classList.replace(tabInactiveClass, tabActiveClass);
                        tab.contents.classList.replace(tabInactiveClass, tabActiveClass);
                    }
                    else {
                        console.log(`Cannot display tab. No tab ${tabName} exists`);
                    }
                }
                navigateToHash(hash) {
                    console.log(`Navigating to hash ${hash}`);
                    if (hash) {
                        Object.keys(this.tabs).find((tabName) => {
                            if (this.tabs[tabName].contents.querySelector(hash)) {
                                this.onTabClicked(tabName);
                                io_5.UpdateContentScroll();
                                return true;
                            }
                            else {
                                return false;
                            }
                        });
                    }
                }
            };
            customElements.define(tabContainerName, TabContainer);
        }
    };
});
System.register("custom-elements/custom-elements", ["custom-elements/ap-theme-container", "custom-elements/ap-nav-link", "custom-elements/ap-dir-display", "custom-elements/ap-auth-container", "custom-elements/ap-auth-display", "custom-elements/ap-stat-block", "custom-elements/ap-timeline", "custom-elements/ap-display-global", "custom-elements/ap-birthday-generator", "custom-elements/ap-vehicle-stat-block", "custom-elements/ap-template-outlet", "custom-elements/ap-smart-table", "custom-elements/ap-tab-container"], function (exports_24, context_24) {
    "use strict";
    var __moduleName = context_24 && context_24.id;
    return {
        setters: [
            function (_5) {
            },
            function (_6) {
            },
            function (_7) {
            },
            function (_8) {
            },
            function (_9) {
            },
            function (_10) {
            },
            function (_11) {
            },
            function (_12) {
            },
            function (_13) {
            },
            function (_14) {
            },
            function (_15) {
            },
            function (_16) {
            },
            function (_17) {
            }
        ],
        execute: function () {
        }
    };
});
System.register("main", ["custom-elements/custom-elements", "io", "loader", "types/page"], function (exports_25, context_25) {
    "use strict";
    var io_6, loader_6, page_3;
    var __moduleName = context_25 && context_25.id;
    return {
        setters: [
            function (_18) {
            },
            function (io_6_1) {
                io_6 = io_6_1;
            },
            function (loader_6_1) {
                loader_6 = loader_6_1;
            },
            function (page_3_1) {
                page_3 = page_3_1;
            }
        ],
        execute: function () {
            window.test = (name) => {
                console.log(page_3.FindPage(loader_6.globals.pageDirectory, name));
            };
            io_6.InitialLoad().then(() => {
                onpopstate = io_6.OnPopState;
            });
        }
    };
});
