<template>
  <div class="">
    <div style="position: relative">
      <input
        class="ant-input"
        style="color: #a0aec0"
        placeholder="Basic usage"
        allow-clear
      />
      <div
        ref="lblNode"
        style="
          position: absolute;
          top: -2px;
          left: 10px;
          font-size: 12px;
          background: white;
          padding: 0px 2px;
          height: 3px;
          display: flex;
          align-items: center;
          color: #a0aec0;
        "
      >
        {{ inputLabel }}
      </div>
    </div>
  </div>
</template>
<style>
.HelloWorldWidget {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  text-align: left;
}
</style>

<script>
import DojoWidget from "dojo/DojoWidget";
import lang from "dojo/_base/lang";
import on from "dojo/on";
import touch from "dojo/touch";
import UIWidget from "core/widgets/UIWidget";
import TextBox from "core/widgets/TextBox";
import Color from "dojo/_base/Color";
import css from "dojo/css";

export default {
  name: "InputBasicTitle",
  mixins: [UIWidget, DojoWidget, TextBox],
  data: function () {
    return {
      inputLabel: "",
      value: null,
      mode: "edit",
      hasFocus: false,
      style: {},
      model: {},
    };
  },
  components: {},
  computed: {
    options() {
      return this.style.options;
    },
  },
  methods: {
    getName() {
      return "Hello World";
    },

    postCreate() {

      if (this.mode == "simulator") {
        this.input = document.createElement("input");
        this.input.type = "text";
      } else {
        this.input = document.createElement("div");
        css.add(this.input, "MatcWidgetTypeTextBoxPreview");
      }
      
      css.add(this.input, "MatcWidgetTypeTextBoxInput");
      this.domNode.appendChild(this.input);
      this._borderNodes = [this.input];
      this._backgroundNodes = [this.input];
      this._paddingNodes = [this.input];
      this._shadowNodes = [this.input];
      this._labelNodes = [this.domNode];
    },

    getCreateTemplates() {
      return [
        {
          id: "AntInput",
          type: "ExampleInputBasicTitle", // must be the same as tghe name used in the SymbolService
          _type: "Widget",
          category: "CIPS",
          subcategory: "AAAAAA",
          name: "InputBasicTitle",
          x: 0,
          y: 0,
          w: 100,
          h: 30,
          z: 0,
          props: {
            label: "Label",
            placeholderText: "Enter a value",
            placeholder: true,
          },
          has: {
            backgroundColor: true,
            data: true,
            border: true,
            label: true,
            padding: true,
            advancedText: true,
          },
          style: {
            fontSize: 20,
            fontFamily: "Helvetica Neue,Helvetica,Arial,sans-serif",
            textAlign: "left",
            letterSpacing: 0,
            lineHeight: 1,
            color: "#333333",
            borderTopRightRadius: 0,
            borderTopLeftRadius: 0,
            borderBottomRightRadius: 0,
            borderBottomLeftRadius: 0,
            borderTopWidth: 0,
            borderBottomWidth: 0,
            borderRightWidth: 0,
            borderLeftWidth: 0,
            borderTopStyle: "solid",
            borderBottomStyle: "solid",
            borderRightStyle: "solid",
            borderLeftStyle: "solid",
            borderTopColor: "#333333",
            borderBottomColor: "#333333",
            borderRightColor: "#333333",
            borderLeftColor: "#333333",
            background: null,
          },
          error: {
            borderTopColor: "#cc0000",
            borderBottomColor: "#cc0000",
            borderRightColor: "#cc0000",
            borderLeftColor: "#cc0000",
            background: "#ffcaca",
          },
          focus: {
            background: "#f2f2f2",
          },
        },
        {
          id: "TextBox",
          type: "TextBox",
          _type: "Widget",
          category: "CIPS",
          subcategory: "AFormInput",
          name: "Text Box",
          x: 0,
          y: 0,
          w: 200,
          h: 40,
          z: 0,
          props: {
            label: "Enter a value",
            placeholder: true,
          },
          has: {
            label: true,
            backgroundColor: true,
            border: true,
            editable: true,
            onclick: true,
            padding: true,
          },
          style: {
            color: "#333333",
            fontFamily: "Helvetica Neue,Helvetica,Arial,sans-serif",
            borderTopRightRadius: 3,
            borderTopLeftRadius: 3,
            borderBottomRightRadius: 3,
            borderBottomLeftRadius: 3,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderRightWidth: 1,
            borderLeftWidth: 1,
            fontSize: 18,
            borderTopColor: "#333333",
            borderBottomColor: "#333333",
            borderRightColor: "#333333",
            borderLeftColor: "#333333",
            background: "#ffffff",
            paddingTop: 5,
            paddingBottom: 5,
            paddingLeft: 5,
            paddingRight: 5,
            textAlign: "left",
          },
          error: {
            borderTopColor: "#cc0000",
            borderBottomColor: "#cc0000",
            borderRightColor: "#cc0000",
            borderLeftColor: "#cc0000",
            background: "#ffcaca",
          },
          focus: {
            background: "#f2f2f2",
          },
        },
      ];
    },

    getDataProperties() {
      return [
        {
          label: "Text is a Placeholder",
          type: "text",
          
        },
        {
          label: "Space",
          type: "Number",
          key: "space",
          isProp: false,
        },
        {
          label: "Another Number",
          type: "Number",
          options: [10, 20, 30],
          key: "foo",
          isProp: false,
        },
        {
          label: "Checkbox",
          type: "Boolean",
          key: "bool",
          isProp: false,
        },
        {
          label: " Color",
          type: "Color",
          icon: "mdi-table-large",
          key: "anotherColor",
          isProp: false,
        },
        {
          label: "Options",
          type: "Options",
          options: [
            { label: "A", inputLabel: "A" },
            { label: "B", inputLabel: "B" },
          ],
          key: "options",
          isProp: false,
        },
      ];
    },

    wireEvents() {
      this.own(
        this.addClickListener(this.domNode, lang.hitch(this, "onClick"))
      );
      this.own(
        on(this.domNode, touch.over, lang.hitch(this, "onDomMouseOver"))
      );
      this.own(on(this.domNode, touch.out, lang.hitch(this, "onDomMouseOut")));
    },

    getLabelNode() {
      return this.$refs.lblNode;
    },

    getInputLabel() {
      return this.inputLabel;
    },

    setInputLabel(inputLabel) {
      this.inputLabel = inputLabel;
    },

    getInputLabelState() {
      return [
        {
          type: "inputLabel",
          inputLabel: this.inputLabel,
        },
        {
          type: "text",
          value: this._readValue(),
          options: {
            valid: this.lastValidation,
            focus: this.hasFocus,
          },
        },
      ];
    },

    setInputLabelState(state) {
      /**
       * Hack for the time when we use the getValueLabel() mechnism!
       */
      if (this.hackValueLabel) {
        return;
      }
      if (state && state.type == "inputLabel") {
        this.setInputLabel(state.inputLabel);
      }
    },

    resize() {},

    onClick: function (e) {
      this.stopEvent(e);
      this.emitClick(e);
    },

    //==========================================================================
    // - Input Stuff -
    //==========================================================================

    onInputClick(e) {
      this.log.log(0, "onInputClick", "enter");
      this.stopPropagation(e);
      this.emitClick(e);
    },

    onFocus(e) {
      this.log.log(0, "onFocus", "enter >" + this.lastValidation);
      this.stopPropagation(e);

      this.keyUpListener = on(this.input, "keyup", lang.hitch(this, "onKeyUp"));
      this.keyDownListener = on(
        this.input,
        "keydown",
        lang.hitch(this, "onKeyDown")
      );
      if (this.model.focus && this.lastValidation) {
        this.emitAnimation(this.model.id, 0, this.model.focus);
      }
      this.hasFocus = true;
      this.emit("focus", {});
      this.afterFocus();
    },

    afterFocus() {
      this.initCompositeState(this._readValue());
    },

    onKeyUp() {
      this.log.log(3, "onKeyUp", "enter > ");
      this.addCompositeSubState(this._readValue());
      this.value = this._readValue();
      this.emit("keyUp", this._readValue());
    },

    onKeyDown(e) {
      this.log.log(3, "onKeyDown", "enter > ");
      const key = e.which || e.keyCode;
      if (13 == key) {
        this.onEnterPressed();
      }
    },

    onEnterPressed() {
      this.input.blur();
      var gesture = {
        type: "KeyboardEnter",
      };
      this.emit("gesture", gesture);
    },

    onChange() {
      // force blur to flush out data binding before
      // any transitions are fired
      this.onBlur();
      const gesture = {
        type: "InputChange",
      };
      this.emit("gesture", gesture);
    },

    onBlur(e) {
      this.log.log(1, "onBlur", "enter");
      this.stopPropagation(e);

      var v = this._readValue();

      this.emitCompositeState("text", v);
      this.emitDataBinding(v);

      var valid = this.validate(this._readValue(), true);
      if (valid) {
        if (this.model.focus) {
          this.emitAnimation(this.model.id, 0, this.style);
        }
      }
      this.value = this._readValue();
      this.cleanUp();
      this.hasFocus = false;
      this.emit("blur", {});
    },

    getStateOptions() {
      return {
        valid: this.lastValidation,
        focus: this.hasFocus,
      };
    },

    getState() {
      return {
        type: "text",
        value: this._readValue(),
        options: {
          valid: this.lastValidation,
          focus: this.hasFocus,
        },
      };
    },

    /**
     * Subclasses my overwrite this...
     */
    _readValue() {
      if (this.mode == "simulator") {
        return this.input.value;
      } else {
        return this.input.innerHTML;
      }
    },

    setState(state, t) {
      if (state && state.type == "text") {
        /**
         * If we have children its an animation...
         */
        if (state.children) {
          let substate = this.getLastSubState(state, t);
          if (substate) {
            let value = substate.value;
            this.setValue(value);
          }
        } else {
          this.setValue(state.value);
        }
      }
      if (state && state.type == "typing") {
        /**
         * DEPRECTAED:
         */
        let substate = this.getLastSubState(state, t);
        if (substate) {
          let value = substate.value;
          this.setValue(value);
        }
      }

      this.afterSetState(state, t);
    },

    /**
     * child classes can overwrite
     */
    afterSetState() {},

    cleanUp() {
      if (this.keyUpListener) {
        this.keyUpListener.remove();
      }
      delete this.keyUpListener;
      if (this.keyDownListener) {
        this.keyDownListener.remove();
      }
      delete this.keyDownListener;
    },

    render(model, style, scaleX, scaleY) {
      this.model = model;
      this.style = style;
      this._validStyle = lang.clone(style);
      this._scaleX = scaleX;
      this._scaleY = scaleY;

      if (model.props && model.props.label) {
        this.setInputLabel(model.props.label);
      }

      if (model.props.options) {
        this.hasTypeahead = true;
        this.hints = model.props.options;
      } else {
        this.hints = [];
      }

      if (model.props.stringCase) {
        css.add(this.domNode, "MatcWidgetTypeTextBox" + model.props.stringCase);
      } else {
        css.remove(this.domNode, "MatcWidgetTypeTextBoxUpperCase");
        css.remove(this.domNode, "MatcWidgetTypeTextBoxLowerCase");
      }

      if (model.props.placeholderText) {
        if (model.props.placeholder) {
          this.setPlaceholder(model.props.placeholderText);
        } else {
          this.setValue(model.props.placeholderText, true);
        }
      }

      if (model.props.validation && this.mode == "simulator") {
        const validation = model.props.validation;
        let type = validation.type;
        if (type == "custom") {
          type = validation.subtype;
        }
        switch (type) {
          case "int":
            this.input.type = "number";
            break;
          case "double":
            this.input.type = "number";
            break;
          case "email":
            this.input.type = "email";
            break;
          case "phone":
            this.input.type = "tel";
            break;
          default:
            break;
        }
      }
      /**
       * WbeKit cannot show the placeholder in the right color.. fucker. So
       * we have to set a pseudo class...
       */
      if (this.mode == "simulator") {
        /**
         * Create a unique class for this run of the simulator to avoid overwriting or some other
         * stuff
         *
         */
        const selector = model.id + "" + new Date().getTime();

        const placeholderStyle = {
          color: this.getPlaceHolderColor(style),
        };

        /**
         * FIXME: Add other browsers as well
         */
        this.addCssClass(
          selector + "::-webkit-input-placeholder",
          placeholderStyle
        );

        /**
         * Add the pseudo class
         */
        css.add(this.input, selector);
      }

      this.beforeSetStyle(style, model);

      this.setStyle(style, model);
    },

    /**
     * Child classes can do something in here
     */
    beforeSetStyle() {},

    getPlaceHolderColor(style) {
      const c = new Color(style.color);
      c.a = 0.5;
      return c.toString();
    },

    addCssClass(selector, styles) {
      if (!this._styleNode) {
        this._styleNode = [];
      }
      const style = document.createElement("style");
      style.type = "text/css";
      style.setAttribute("matc", "true");
      let s = "." + selector + "{";
      for (let key in styles) {
        s += key + " :" + styles[key] + ";";
      }
      s += "}";
      style.innerHTML = s;
      document.getElementsByTagName("head")[0].appendChild(style);
      this._styleNode.push(style);


      if (model.props.stringCase) {
        css.add(this.domNode, "MatcWidgetTypeTextBox" + model.props.stringCase);
      } else {
        css.remove(this.domNode, "MatcWidgetTypeTextBoxUpperCase");
        css.remove(this.domNode, "MatcWidgetTypeTextBoxLowerCase");
      }

      if (model.props.label) {
        if (model.props.placeholder) {
          this.setPlaceholder(model.props.label);
        } else {
          this.setValue(model.props.label, true);
        }
      }

      if (model.props.validation && this.mode == "simulator") {
        const validation = model.props.validation;
        let type = validation.type;
        if (type == "custom") {
          type = validation.subtype;
        }
        switch (type) {
          case "int":
            this.input.type = "number";
            break;
          case "double":
            this.input.type = "number";
            break;
          case "email":
            this.input.type = "email";
            break;
          case "phone":
            this.input.type = "tel";
            break;
          default:
            break;
        }
      }

    },

    getValue() {
      return this.value;
    },

    unsetPlaceHolder() {
      css.remove(this.input, "MatcWidgetTypeTextBoxInputPlaceholder");
      this.input.style.color = this.style.color;
    },

    setPlaceholder(msg) {
      if (this.mode == "simulator") {
        this.input.placeholder = msg;
      } else {
        css.add(this.input, "MatcWidgetTypeTextBoxInputPlaceholder");
        this.input.innerHTML = msg;
        this.input.style.color = this.getPlaceHolderColor(this.style);
      }
    },

    setValue(value, ignoreValidation) {
      this.unsetPlaceHolder();
      if (value != null && value != undefined && this.value != value) {
        this.value = value;
        if (this.mode == "simulator") {
          this.input.value = value;
        } else {
          this.input.innerHTML = value;
          if (this.model.props.placeholder) {
            if (this.model.props.label != value) {
              this.input.style.color = this.style.color;
            } else {
              this.input.style.color = this.getPlaceHolderColor(this.style);
            }
          }
        }

        if (!ignoreValidation) {
          this.validate(this.value, true);
        }
      }
    },

    _validateValue(value) {
      const validation = this.model.props.validation;
      if (validation) {
        let type = validation.type;
        if (type == "custom") {
          type = validation.subtype;
        }

        /**
         * Now come the rules
         */
        if (validation.required && value == "") {
          return false;
        }

        if (!value) {
          return true;
        }

        if (type == "int") {
          let re = /^-?[0-9]+$/;
          if (re.test(value)) {
            let inRange = true;
            if (validation.min != null && validation.min != undefined) {
              inRange = inRange && value >= validation.min;
            }

            if (validation.max != null && validation.max != undefined) {
              inRange = inRange && value <= validation.max;
            }

            return inRange;
          } else {
            return false;
          }
        }

        if (type == "email") {
          let re = /\S+@\S+\.\S+/;
          return re.test(value);
        }

        if (type == "phone") {
          let re = /^[\+]?([0-9]|[-\s\.])*$/;
          return re.test(value);
        }

        if (type == "date") {
          let re = /^[0-9]{1,2}(\/|-|\.)[0-9]{1,2}(\/|-|\.)[0-9]{2,4}$/;
          return re.test(value);
        }
        if (type == "time") {
          let re = /^[0-9]{2}(\/|-|\.|\:)[0-9]{1,2}$/;
          return re.test(value);
        }

        if (type == "double") {
          var re = /^-?[0-9]+((\.|,)[0-9]+)?$/;
          if (re.test(value)) {
            let inRange = true;
            if (validation.min != null && validation.min != undefined) {
              inRange = inRange && value >= validation.min;
            }

            if (validation.max != null && validation.max != undefined) {
              inRange = inRange && value <= validation.max;
            }

            return inRange;
          } else {
            return false;
          }
        }

        if (type == "string") {
          var operator = validation.operator;

          /**
           * if the value is undefined that is fine for me
           */
          if (value) {
            if (operator == "contains" && validation.text) {
              return value.indexOf(validation.text) >= 0;
            }

            if (operator == "equals" && validation.text) {
              return value == validation.text;
            }

            if (operator == "pattern" && validation.pattern) {
              // eslint-disable-next-line no-undef
              var reg = new Regex(validation.pattern);
              return reg.test(value);
            }

            if (operator == "length") {
              let validString = true;
              if (validation.min != null && validation.min != undefined) {
                validString = validString && value.length >= validation.min;
              }
              if (validation.max != null && validation.max != undefined) {
                validString = validString && value.length <= validation.max;
              }
              return validString;
            }
          }
        }
      }

      return true;
    },

    isValid: function (showError) {
      return this.validate(this._readValue(), showError);
    },

    _setDataBindingValue(v) {
      if (this.isQDate(v)) {
        v = this.convertQDateToString(v);
      }
      this.setValue(v);
    },

    beforeDestroy() {
      if (this._compositeState) {
        this.emitCompositeState("text", this.input.value);
      }

      this.cleanUpTempListener();

      try {
        if (this._styleNode) {
          for (var i = 0; i < this._styleNode.length; i++) {
            var node = this._styleNode[i];
            node.parentNode.removeChild(node);
          }
          delete this._styleNode;
        }
      } catch (e) {
        console.warn("TextBox.destroy()", e);
      }

      this.cleanUp();
    },
  },
};
</script>
