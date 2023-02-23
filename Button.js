// ==================================================
// BUTTON CLASS
// ==================================================

class Button extends Phaser.GameObjects.Container 
{
    constructor (scene, x=scene.scale.width/2, y=scene.scale.height/2, data={}) 
    {
        super(scene, x, y).setDataEnabled();
        scene.add.existing(this);

        // DATA - Start
        this.data.set('w', data.w || 240);
        this.data.set('h', data.h || 80);
        this.data.set('txt', data.txt || 'Button');
        this.data.set('txtsize', data.txtsize || '5em');
        this.data.set('txtcolor', data.txtcolor || '#FFFFFF');
        this.data.set('texture', data.texture || 'gui_btns');
        this.data.set('btn', {name:'main_blue0'});
        // DATA - End?

        // CREATE - Start
        data = this.data.getAll();
        this.base = scene.add.sprite(0, 0, data.texture);
        this.txt = this.scene.add.text(0, 0, data.txt, { align:'center',
            color:data.txtcolor, fontSize:data.txtsize, fontFamily:'Font_Header',
            wordWrap:{width:data.w-25} }).setOrigin(0.5, 0.5);
        this.btn_setSize(data.w, data.h).add([this.base, this.txt]);
        if (data.texture === 'gui_btns') this.base.setFrame('main_blue3');
        // CREATE - End

        this.on('pointerdown', (pointer, localX, localY, event) => {
            this.txt.setPosition(5, 3);
            this.base.setFrame(data.btn.name+'3');
        }).on('pointerup', (pointer, localX, localY, event) => {
            this.txt.setPosition(0, 0);
            this.base.setFrame(data.btn.name+'1');
        }).on('pointerover', (pointer, localX, localY, event) => {
            this.txt.setPosition(-5, -3);
            this.base.setFrame(data.btn.name+'2');
        }).on('pointerout', (pointer, localX, localY, event) => {
            this.txt.setPosition(0, 0);
            this.base.setFrame(data.btn.name+'1');
        });
    }



    btn_setText (txt='', size=this.data.get('txtsize'), color=this.data.get('txtcolor')) 
    {
        this.data.set('txt', txt);
        this.data.set('txtsize', size);
        this.data.set('txtcolor', color);
        this.txt.setText(txt).setFontSize(size).setColor(color);
        return this;
    }

    btn_setSize (w=240, h=80) 
    {
        this.base.setDisplaySize(w, h);
        this.txt.setWordWrapWidth(w-40);
        this.setSize(w, h).setInteractive({useHandCursor:true});
        this.input.hitArea.setTo(0, 0, w, h);
        this.data.set('w', w);
        this.data.set('h', h);
        return this;
    }

    setButton (frame='main_blue0') 
    {
        this.base.setFrame(frame+'1');
        this.btn_setSize(this.data.get('w'), this.data.get('h'));
        this.data.get('btn').name = frame; return this;
    }
}
