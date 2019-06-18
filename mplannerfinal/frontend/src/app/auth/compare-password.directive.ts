import { AbstractControl } from '@angular/forms';

export class PasswordValidation {

    parent: string;
    child: string;

    static MatchPassword(abstractControl: AbstractControl) {
        const password = abstractControl.get('password').value;
        const confirmPassword = abstractControl.get('confirmPassword').value;

        if (password !== confirmPassword) {
            abstractControl.get('confirmPassword').setErrors({ MatchPassword: true });
        } else {
            abstractControl.get('confirmPassword').setErrors(null);
            return null;
        }
    }

    private get isParent() {
        if (!this.parent) {
            return false;
        }
        return this.parent === 'true' ? true : false;
    }

}