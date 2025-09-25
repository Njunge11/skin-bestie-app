CREATE TYPE "public"."subscription_status" AS ENUM('cancelled', 'not_yet', 'active');--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" varchar(120) NOT NULL,
	"last_name" varchar(120) NOT NULL,
	"phone_number" varchar(32) NOT NULL,
	"email" varchar(255) NOT NULL,
	"date_of_birth" date NOT NULL,
	"skin_type" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"concerns" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"has_allergy" boolean DEFAULT false NOT NULL,
	"allergy" text,
	"subscription" "subscription_status" DEFAULT 'not_yet' NOT NULL,
	"initial_booking" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
