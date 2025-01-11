(function() {
    var Dialog = Mario.Dialog = function() {
        this.active = false;
        this.text = "";
        this.position = { x: 50, y: 50 };
        
        this.funFacts = {
            regular: [
                "Did you know? Mario was named after Nintendo's warehouse landlord!",
                "The clouds and bushes in Mario use the same sprite!",
                "Mario's original job was a carpenter, not a plumber!"
            ],
        };
    };

    Dialog.prototype.show = function(text) {
        this.active = true;
        this.text = text;
    };

    Dialog.prototype.hide = function() {
        this.active = false;
        this.text = "";
    };

    Dialog.prototype.draw = function(ctx) {
        if (!this.active) return;
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(this.position.x, this.position.y, 400, 100);
        ctx.strokeStyle = 'white';
        ctx.strokeRect(this.position.x, this.position.y, 400, 100);
        
        ctx.fillStyle = 'white';
        ctx.font = '16px Arial';
        ctx.fillText(this.text, this.position.x + 20, this.position.y + 40);
    };
})();
