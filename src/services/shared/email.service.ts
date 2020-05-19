import { TO, doRequest, TE } from "../../utils"
import { isEmpty, isNotEmpty } from "class-validator"
import { Email } from "../../entity/shared/Email"

type EmailParameters = {
    from: string,
    to: string,
    cc?: string,
    bcc?: string,
    subject: string,
    text?: string,
    html?: string,
    ampHtml?: string,
}

const MG_API_KEY = "35a15be3fe80618a2c95ac3053532a52-e470a504-5e9f55ea"

const MG_BASE_URL = `https://api:${MG_API_KEY}@api.mailgun.net/v3/mg.underk.in/messages`

export class EmailService {
    static send = async (data: EmailParameters) => {
        let err: any, res: any
        if (isEmpty(data)) {
            TE("Email data not provided")
        }
        if (isEmpty(data.subject)) {
            TE("Email subject not provided")
        }
        if (isEmpty(data.from)) {
            data.from = 'no-reply@underk.in'
        }

        let formData = new URLSearchParams();
        let email: Email = new Email(data.from, data.to, data.subject, data.cc, data.bcc, data.text, data.html, data.ampHtml)
        formData.set('from', data.from);
        formData.set('subject', data.subject);
        if (isNotEmpty(data.to)) {
            formData.set('to', data.to as string)
        }
        if (isNotEmpty(data.cc)) {
            formData.set('cc', data.cc as string)
        }
        if (isNotEmpty(data.bcc)) {
            formData.set('bcc', data.bcc as string)
        }
        if (isNotEmpty(data.text)) {
            formData.set('text', data.text as string)
        }
        if (isNotEmpty(data.html)) {
            formData.set('html', data.html as string)
        }
        if (isNotEmpty(data.ampHtml)) {
            formData.set('amp-html', data.ampHtml as string)
        }


        [err, res] = await TO(doRequest({ url: MG_BASE_URL, data: formData, method: 'POST' }))

        if (err) {
            email.error = err;
            let error
            [error] = await TO(email.save())
            if (error) {
                TE(error)
            }
            TE(err)
        }

        [err] = await TO(email.save())
        if (err) TE(err)
    }
}
