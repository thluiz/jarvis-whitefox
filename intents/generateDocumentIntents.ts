import * as builder from "botbuilder";
import { IFormattingOptions, UtilsService } from "../domain/services/utilsService";
import { IntentBase } from "./intentBase";
import { IntentEntities } from "./intentEntities";

const IE = new IntentEntities();

export class GenerateDocumentIntents extends IntentBase {

    private DocumentTypes = {
        CNPJ: "cnpj",
        CPF: "cpf",
    };

    public setup(dialog: builder.IntentDialog): void {
        const self: GenerateDocumentIntents = this;
        dialog.matches("generate_document", [
            (session, args, next) => {
                const documentType = builder.EntityRecognizer.findEntity(args.entities, IE.DocumentType);

                if (!documentType) {
                    session.send("Desculpe, acho que não entendi o que você falou.");
                    session.send("Somente podemos gerar números de CPF e CNPJ por enquanto.");
                    session.endDialog();
                    return;
                }

                if (documentType.entity !== this.DocumentTypes.CPF
                    && documentType.entity !== this.DocumentTypes.CNPJ) {
                    session.endDialog(`Desculpe, ainda não tenho gerador para ${documentType.entity}`);
                    return;
                }

                let formatting = { withDashs: true, withDots: true, withSlashs: true, withFluffy: false };
                builder.EntityRecognizer.findAllEntities(args.entities, IE.Details).forEach((result) => {
                    formatting = self.setFormatting(formatting, result);
                });

                const document: string = documentType.entity === this.DocumentTypes.CPF ?
                    UtilsService.generateCPF(formatting)
                    : UtilsService.generateCNPJ(formatting);

                session.endDialog(UtilsService.funnyResultMessage(documentType.entity.toLocaleUpperCase(), document));
            },
        ]);
    }

    private setFormatting(formatting: IFormattingOptions, result: builder.IEntity): IFormattingOptions {

        if (result.entity.indexOf("formatado") >= 0) {
            if (result.entity.indexOf("desformatado") >= 0) {
                formatting.withDashs = false;
                formatting.withDots = false;
                formatting.withSlashs = false;
            } else {
                formatting.withDashs = true;
                formatting.withDots = true;
                formatting.withSlashs = true;
            }
        }

        if (result.entity.indexOf("com") >= 0) {
            if (result.entity.indexOf("traços") >= 0) {
                formatting.withDashs = true;
            }

            if (result.entity.indexOf("pontos") >= 0) {
                formatting.withDots = true;
            }

            if (result.entity.indexOf("barra") >= 0) {
                formatting.withSlashs = true;
            }

            if (result.entity.indexOf("formatação") >= 0) {
                formatting.withSlashs = true;
                formatting.withDots = true;
                formatting.withDashs = true;
            }
        }

        if (result.entity.indexOf("bonit") >= 0) {
            formatting.withFluffy = true;
        }

        if (result.entity.indexOf("sem") >= 0) {
            if (result.entity.indexOf("traços") >= 0) {
                formatting.withDashs = false;
            }

            if (result.entity.indexOf("pontos") >= 0) {
                formatting.withDots = false;
            }

            if (result.entity.indexOf("barra") >= 0) {
                formatting.withSlashs = false;
            }

            if (result.entity.indexOf("formatação") >= 0) {
                formatting.withSlashs = false;
                formatting.withDots = false;
                formatting.withDashs = false;
            }
        }

        return formatting;
    }
}
