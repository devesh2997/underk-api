import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class Email extends BaseEntity {

    constructor(from: string, to: string, subject: string, cc?: string, bcc?: string, text?: string, html?: string, ampHtml?: string) {
        super()
        this.from = from
        this.to = to
        this.cc = cc
        this.bcc = bcc
        this.subject = subject
        this.text = text
        this.html = html
        this.ampHtml = ampHtml
    }

    @PrimaryGeneratedColumn()
    id: number

    @Column({ default: 'mail-gun' })
    provider: string

    @Column()
    from: string

    @Column()
    to: string

    @Column({ nullable: true })
    cc?: string

    @Column({ nullable: true })
    bcc?: string

    @Column()
    subject: string

    @Column({ nullable: true })
    text?: string

    @Column({ nullable: true })
    html?: string

    @Column({ nullable: true })
    ampHtml?: string

    @Column({ nullable: true })
    error: string

    @CreateDateColumn()
    created_at: Date

}