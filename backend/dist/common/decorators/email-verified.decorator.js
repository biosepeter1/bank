"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get REQUIRE_EMAIL_VERIFIED_KEY () {
        return REQUIRE_EMAIL_VERIFIED_KEY;
    },
    get RequireEmailVerified () {
        return RequireEmailVerified;
    }
});
const _common = require("@nestjs/common");
const REQUIRE_EMAIL_VERIFIED_KEY = 'requireEmailVerified';
const RequireEmailVerified = ()=>(0, _common.SetMetadata)(REQUIRE_EMAIL_VERIFIED_KEY, true);

//# sourceMappingURL=email-verified.decorator.js.map