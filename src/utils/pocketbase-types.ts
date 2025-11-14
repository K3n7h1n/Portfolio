/**
 * This file was @generated using pocketbase-typegen
 */

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	MessagesContact = "messages_contact",
	Projets = "projets",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

// System fields
export type BaseSystemFields<T = never> = {
	id: RecordIdString
	created: IsoDateString
	updated: IsoDateString
	collectionId: string
	collectionName: Collections
	expand?: T
}

export type AuthSystemFields<T = never> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type MessagesContactRecord = {
	nom?: string
	email?: string
	message?: string
}

export type ProjetsRecord = {
	titre?: string
	nom?: string
	description?: string
	description_courte?: string
	description_complete?: string
	details?: string
	photo_principale?: string
	tags?: string[]
	categorie?: string
	type?: string
	slug?: string
	ordre_affichage?: number
	date_realisation?: IsoDateString
	afficher?: boolean
	lien_externe?: string
	lien_demo?: string
	lien_github?: string
	lien_figma?: string
	lien_divers?: string
	client?: string
	technologies?: string[]
	images_secondaires?: string[]
	galerie_photos?: string[]
	informations?: string | Record<string, any>
}

// Response types include system fields and match responses from the PocketBase API
export type MessagesContactResponse<Texpand = unknown> = Required<MessagesContactRecord> & BaseSystemFields<Texpand>
export type ProjetsResponse<Texpand = unknown> = Required<ProjetsRecord> & BaseSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	messages_contact: MessagesContactRecord
	projets: ProjetsRecord
}

export type CollectionResponses = {
	messages_contact: MessagesContactResponse
	projets: ProjetsResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: 'messages_contact'): RecordService<MessagesContactResponse>
	collection(idOrName: 'projets'): RecordService<ProjetsResponse>
}
