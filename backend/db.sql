-- DROP SCHEMA public;

CREATE SCHEMA public AUTHORIZATION postgres;

COMMENT ON SCHEMA public IS 'standard public schema';
-- public."configuration" definition

-- Drop table

-- DROP TABLE public."configuration";

CREATE TABLE public."configuration" (
	slug text NOT NULL,
	value text NULL,
	CONSTRAINT configuration_pk PRIMARY KEY (slug)
);


-- public.users definition

-- Drop table

-- DROP TABLE public.users;

CREATE TABLE public.users (
	id uuid NOT NULL DEFAULT gen_random_uuid(),
	username varchar NOT NULL,
	"password" text NOT NULL,
	profilepictureurl text NULL,
	"role" int2 NULL DEFAULT 2, -- 0: admin, 1: mod, 2: users
	"name" text NULL,
	disabled bool NULL DEFAULT false,
	CONSTRAINT user_check CHECK (((role >= 0) AND (role <= 2))),
	CONSTRAINT user_pk PRIMARY KEY (id),
	CONSTRAINT users_un UNIQUE (username)
);
CREATE INDEX user_username_idx ON public.users USING btree (username);

-- Column comments

COMMENT ON COLUMN public.users."role" IS '0: admin, 1: mod, 2: users';


-- public.questions definition

-- Drop table

-- DROP TABLE public.questions;

CREATE TABLE public.questions (
	id uuid NOT NULL DEFAULT gen_random_uuid(),
	uid uuid NOT NULL,
	"content" text NULL,
	status int2 NULL,
	created_at date NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at date NULL DEFAULT CURRENT_TIMESTAMP,
	title text NOT NULL,
	CONSTRAINT question_check CHECK (((status >= 0) AND (status <= 2))),
	CONSTRAINT question_pk PRIMARY KEY (id),
	CONSTRAINT question_fk FOREIGN KEY (uid) REFERENCES public.users(id) ON DELETE CASCADE
);
CREATE INDEX questions_title_idx ON public.questions USING btree (title);


-- public.answers definition

-- Drop table

-- DROP TABLE public.answers;

CREATE TABLE public.answers (
	id uuid NOT NULL DEFAULT gen_random_uuid(),
	qid uuid NOT NULL,
	uid uuid NOT NULL,
	"content" text NULL,
	correct bool NULL,
	created_at date NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at date NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT answer_pk PRIMARY KEY (id),
	CONSTRAINT answer_fk FOREIGN KEY (uid) REFERENCES public.users(id) ON DELETE CASCADE,
	CONSTRAINT answer_fk_1 FOREIGN KEY (qid) REFERENCES public.questions(id) ON DELETE CASCADE
);


-- public.voting definition

-- Drop table

-- DROP TABLE public.voting;

CREATE TABLE public.voting (
	id uuid NOT NULL DEFAULT gen_random_uuid(),
	aid uuid NOT NULL,
	uid uuid NOT NULL,
	status bool NULL,
	CONSTRAINT voting_pk PRIMARY KEY (id),
	CONSTRAINT voting_fk FOREIGN KEY (uid) REFERENCES public.users(id) ON DELETE CASCADE,
	CONSTRAINT voting_fk_1 FOREIGN KEY (aid) REFERENCES public.answers(id) ON DELETE CASCADE
);
