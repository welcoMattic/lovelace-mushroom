import { fireEvent, HomeAssistant } from "custom-card-helpers";
import { CSSResultGroup, html, LitElement, TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import memoizeOne from "memoize-one";
import { configElementStyle } from "../../../utils/editor-styles";
import { HaFormSchema } from "../../../utils/form/ha-form";
import { computeChipEditorComponentName } from "../../../utils/lovelace/chip/chip-element";
import { EntityChipConfig } from "../../../utils/lovelace/chip/types";
import { LovelaceChipEditor } from "../../../utils/lovelace/types";
import { DEFAULT_BACK_ICON } from "./back-chip";

const computeSchema = memoizeOne((icon?: string): HaFormSchema[] => [
    { name: "icon", selector: { icon: { placeholder: icon } } },
]);

@customElement(computeChipEditorComponentName("back"))
export class BackChipEditor extends LitElement implements LovelaceChipEditor {
    @property({ attribute: false }) public hass?: HomeAssistant;

    @state() private _config?: EntityChipConfig;

    public setConfig(config: EntityChipConfig): void {
        this._config = config;
    }

    private _computeLabelCallback = (schema: HaFormSchema) => {
        return this.hass!.localize(`ui.panel.lovelace.editor.card.generic.${schema.name}`);
    };

    protected render(): TemplateResult {
        if (!this.hass || !this._config) {
            return html``;
        }

        const icon = this._config.icon || DEFAULT_BACK_ICON;
        const schema = computeSchema(icon);

        return html`
            <ha-form
                .hass=${this.hass}
                .data=${this._config}
                .schema=${schema}
                .computeLabel=${this._computeLabelCallback}
                @value-changed=${this._valueChanged}
            ></ha-form>
        `;
    }

    private _valueChanged(ev: CustomEvent): void {
        fireEvent(this, "config-changed", { config: ev.detail.value });
    }

    static get styles(): CSSResultGroup {
        return configElementStyle;
    }
}
