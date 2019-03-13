import {Injectable} from "@angular/core";

@Injectable()
export class BreadcrumbService {

    private routesFriendlyNames: Map<string, string> = new Map<string, string>();
    private routesFriendlyNamesRegex: Map<string, string> = new Map<string, string>();
    private routesWithCallback: Map<string, (string) => string> = new Map<string, (string) => string>();
    private routesWithCallbackRegex: Map<string, (string) => string> = new Map<string, (string) => string>();
    private hideRoutes: any = new Array<string>();
    private hideRoutesRegex: any = new Array<string>();

    /**
     * Specify a friendly name for the corresponding route.
     *
     * @param route
     * @param name
     */
    addFriendlyNameForRoute(route: string, name: string): void {
        this.routesFriendlyNames.set(route, name);
    }

    removeFriendlyNameForRoute(routeRegex: string): boolean {
        return this.routesFriendlyNames.delete(routeRegex);
    }
    
    /**
     * Specify a friendly name for the corresponding route matching a regular expression.
     *
     * @param route
     * @param name
     */
    addFriendlyNameForRouteRegex(routeRegex: string, name: string): void {
        this.routesFriendlyNamesRegex.set(routeRegex, name);
    }

    removeFriendlyNameForRouteRegex(routeRegex: string): boolean {
        return this.routesFriendlyNamesRegex.delete(routeRegex);
    }
    
    /**
     * Specify a callback for the corresponding route.
     * When a mathing url is navigatedd to, the callback function is invoked to get the name to be displayed in the breadcrumb.
     */
    addCallbackForRoute(route: string, callback: (id: string) => string): void {
        this.routesWithCallback.set(route, callback);
    }

    removeCallbackForRoute(routeRegex: string): boolean {
        return this.routesWithCallback.delete(routeRegex);
    }
    
    /**
     * Specify a callback for the corresponding route matching a regular expression.
     * When a mathing url is navigatedd to, the callback function is invoked to get the name to be displayed in the breadcrumb.
     */
    addCallbackForRouteRegex(routeRegex: string, callback: (id: string) => string): void {
        this.routesWithCallbackRegex.set(routeRegex, callback);
    }

    removeCallbackForRouteRegex(routeRegex: string): boolean {
        return this.routesWithCallbackRegex.delete(routeRegex);
    }

    /**
     * Show the friendly name for a given route (url). If no match is found the url (without the leading '/') is shown.
     *
     * @param route
     * @returns {*}
     */
    getFriendlyNameForRoute(route: string): string {
        let name;
        let routeEnd = route.substr(route.lastIndexOf('/')+1, route.length);
        
        this.routesFriendlyNames.forEach((value, key, map) => {
            if (key === route) {
                name = value;
            }
        });
        
        this.routesFriendlyNamesRegex.forEach((value, key, map) => {
            if (new RegExp(key).exec(route)) {
                name = value;
            }
        });
        
        this.routesWithCallback.forEach((value, key, map) => {
            if (key === route) {
                name = value(routeEnd);
            }
        });
        
        this.routesWithCallbackRegex.forEach((value, key, map) => {
            if (new RegExp(key).exec(route)) {
                name = value(routeEnd);
            }
        });

        return name ? name : routeEnd;
    }
    
    /**
     * Specify a route (url) that should not be shown in the breadcrumb.
     */
    hideRoute(route: string): void {
        if (!this.hideRoutes.includes(route)) {
            this.hideRoutes.push(route);
        }
    }

    removeHideRoute(routeRegex: string): void {
        if (this.hideRoutes.includes(routeRegex)) {
            this.hideRoutes.splice(this.hideRoutes.indexOf(routeRegex), 1);
        }
    }
    
    /**
     * Specify a route (url) regular expression that should not be shown in the breadcrumb.
     */
    hideRouteRegex(routeRegex: string): void {
        if (!this.hideRoutesRegex.includes(routeRegex)) {
            this.hideRoutesRegex.push(routeRegex);
        }
    }

    removeHideRouteRegex(routeRegex: string): void {
        if (this.hideRoutesRegex.includes(routeRegex)) {
            this.hideRoutesRegex.splice(this.hideRoutesRegex.indexOf(routeRegex), 1);
        }
    }
    
    /**
     * Returns true if a route should be hidden.
     */
    isRouteHidden(route: string): boolean {
        let hide = this.hideRoutes.includes(route);
        
        this.hideRoutesRegex.forEach((value) => {
            if (new RegExp(value).exec(route)) {
                hide = true;
            }
        });
        
        return hide;
    }
}
