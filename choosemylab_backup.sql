--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.2

-- Started on 2026-05-28 17:24:09

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



--
-- TOC entry 5215 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 228 (class 1259 OID 60541)
-- Name: bookings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bookings (
    id integer NOT NULL,
    user_id integer,
    test_id integer,
    patient_name character varying(100),
    patient_phone character varying(20),
    booking_date date,
    time_slot character varying(50),
    lab_branch_id integer,
    user_latitude numeric(10,7),
    user_longitude numeric(10,7),
    user_location character varying(255),
    notes text,
    status character varying(20) DEFAULT 'pending'::character varying
);


--
-- TOC entry 227 (class 1259 OID 60540)
-- Name: bookings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.bookings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5216 (class 0 OID 0)
-- Dependencies: 227
-- Name: bookings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.bookings_id_seq OWNED BY public.bookings.id;


--
-- TOC entry 238 (class 1259 OID 76865)
-- Name: categories_metadata; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categories_metadata (
    id integer NOT NULL,
    category_name character varying(100) NOT NULL,
    icon character varying(100),
    description text,
    long_description text,
    medically_reviewed boolean DEFAULT true,
    stats_labs character varying(100) DEFAULT '128+ certified labs'::character varying,
    stats_bookings character varying(100) DEFAULT '10k+ monthly bookings'::character varying,
    stats_patients character varying(100) DEFAULT '56k+ patients'::character varying,
    tags text[] DEFAULT '{}'::text[]
);


--
-- TOC entry 237 (class 1259 OID 76864)
-- Name: categories_metadata_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.categories_metadata_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5217 (class 0 OID 0)
-- Dependencies: 237
-- Name: categories_metadata_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.categories_metadata_id_seq OWNED BY public.categories_metadata.id;


--
-- TOC entry 258 (class 1259 OID 77128)
-- Name: category_previews; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.category_previews (
    id integer NOT NULL,
    category_name character varying(100) NOT NULL,
    test_id integer,
    package_id integer,
    is_pkg boolean DEFAULT false,
    display_order integer DEFAULT 0,
    CONSTRAINT chk_test_or_package CHECK ((((test_id IS NOT NULL) AND (package_id IS NULL) AND (is_pkg = false)) OR ((test_id IS NULL) AND (package_id IS NOT NULL) AND (is_pkg = true))))
);


--
-- TOC entry 257 (class 1259 OID 77127)
-- Name: category_previews_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.category_previews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5218 (class 0 OID 0)
-- Dependencies: 257
-- Name: category_previews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.category_previews_id_seq OWNED BY public.category_previews.id;


--
-- TOC entry 224 (class 1259 OID 60496)
-- Name: lab_branches; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.lab_branches (
    id integer NOT NULL,
    lab_id integer,
    branch_name character varying(150),
    address text,
    city character varying(100),
    state character varying(100),
    postal_code character varying(20),
    latitude numeric(10,8),
    longitude numeric(11,8),
    phone character varying(30),
    operating_hours character varying(150),
    home_collection boolean DEFAULT true,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- TOC entry 223 (class 1259 OID 60495)
-- Name: lab_branches_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.lab_branches_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5219 (class 0 OID 0)
-- Dependencies: 223
-- Name: lab_branches_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.lab_branches_id_seq OWNED BY public.lab_branches.id;


--
-- TOC entry 236 (class 1259 OID 60623)
-- Name: lab_package_branches; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.lab_package_branches (
    id integer NOT NULL,
    lab_id integer,
    lab_branch_id integer,
    package_id integer,
    price integer,
    reporting_time character varying(50),
    home_collection boolean DEFAULT true,
    discount_label character varying(100),
    notes text,
    is_available boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    discount_percent integer DEFAULT 0,
    original_price integer
);


--
-- TOC entry 235 (class 1259 OID 60622)
-- Name: lab_package_branches_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.lab_package_branches_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5220 (class 0 OID 0)
-- Dependencies: 235
-- Name: lab_package_branches_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.lab_package_branches_id_seq OWNED BY public.lab_package_branches.id;


--
-- TOC entry 240 (class 1259 OID 76881)
-- Name: lab_profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.lab_profiles (
    id integer NOT NULL,
    lab_id integer,
    tagline character varying(255),
    about text,
    established_year integer,
    accreditations text[] DEFAULT '{}'::text[],
    lab_type character varying(50) DEFAULT 'pathology'::character varying,
    total_branches integer DEFAULT 1,
    tests_offered integer DEFAULT 100,
    images text[] DEFAULT '{}'::text[],
    speciality_tags text[] DEFAULT '{}'::text[],
    home_collection boolean DEFAULT true,
    report_time_hours integer DEFAULT 24,
    rating numeric(2,1) DEFAULT 4.0,
    review_count integer DEFAULT 500,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- TOC entry 239 (class 1259 OID 76880)
-- Name: lab_profiles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.lab_profiles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5221 (class 0 OID 0)
-- Dependencies: 239
-- Name: lab_profiles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.lab_profiles_id_seq OWNED BY public.lab_profiles.id;


--
-- TOC entry 226 (class 1259 OID 60515)
-- Name: lab_test_branches; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.lab_test_branches (
    id integer NOT NULL,
    lab_id integer,
    lab_branch_id integer,
    test_id integer,
    price integer,
    reporting_time character varying(50),
    is_available boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    discount_percent integer DEFAULT 0,
    original_price integer
);


--
-- TOC entry 225 (class 1259 OID 60514)
-- Name: lab_test_branches_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.lab_test_branches_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5222 (class 0 OID 0)
-- Dependencies: 225
-- Name: lab_test_branches_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.lab_test_branches_id_seq OWNED BY public.lab_test_branches.id;


--
-- TOC entry 222 (class 1259 OID 60481)
-- Name: labs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.labs (
    id integer NOT NULL,
    name character varying(150) NOT NULL,
    phone character varying(30),
    email character varying(150),
    website character varying(255),
    is_active boolean DEFAULT true,
    is_verified boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    rating numeric(2,1) DEFAULT 4.0,
    booking_count integer DEFAULT 0
);


--
-- TOC entry 221 (class 1259 OID 60480)
-- Name: labs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.labs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5223 (class 0 OID 0)
-- Dependencies: 221
-- Name: labs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.labs_id_seq OWNED BY public.labs.id;


--
-- TOC entry 234 (class 1259 OID 60604)
-- Name: package_tests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.package_tests (
    id integer NOT NULL,
    package_id integer,
    test_id integer
);


--
-- TOC entry 233 (class 1259 OID 60603)
-- Name: package_tests_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.package_tests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5224 (class 0 OID 0)
-- Dependencies: 233
-- Name: package_tests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.package_tests_id_seq OWNED BY public.package_tests.id;


--
-- TOC entry 232 (class 1259 OID 60590)
-- Name: packages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.packages (
    id integer NOT NULL,
    name character varying(150) NOT NULL,
    description text,
    category character varying(50),
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    samples_required character varying(150),
    preparations text,
    why_booked jsonb,
    what_it_measures jsonb,
    faq jsonb
);


--
-- TOC entry 231 (class 1259 OID 60589)
-- Name: packages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.packages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5225 (class 0 OID 0)
-- Dependencies: 231
-- Name: packages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.packages_id_seq OWNED BY public.packages.id;


--
-- TOC entry 242 (class 1259 OID 76909)
-- Name: packages_landing_categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.packages_landing_categories (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    sub_label character varying(100),
    starts_price integer,
    labs_count integer,
    icon character varying(50),
    color_theme character varying(50),
    is_active boolean DEFAULT true,
    display_order integer DEFAULT 0
);


--
-- TOC entry 241 (class 1259 OID 76908)
-- Name: packages_landing_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.packages_landing_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5226 (class 0 OID 0)
-- Dependencies: 241
-- Name: packages_landing_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.packages_landing_categories_id_seq OWNED BY public.packages_landing_categories.id;


--
-- TOC entry 246 (class 1259 OID 76939)
-- Name: packages_landing_faqs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.packages_landing_faqs (
    id integer NOT NULL,
    question text NOT NULL,
    answer text NOT NULL,
    is_active boolean DEFAULT true,
    display_order integer DEFAULT 0
);


--
-- TOC entry 245 (class 1259 OID 76938)
-- Name: packages_landing_faqs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.packages_landing_faqs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5227 (class 0 OID 0)
-- Dependencies: 245
-- Name: packages_landing_faqs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.packages_landing_faqs_id_seq OWNED BY public.packages_landing_faqs.id;


--
-- TOC entry 248 (class 1259 OID 76952)
-- Name: packages_landing_partners; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.packages_landing_partners (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    logo_url character varying(255),
    is_active boolean DEFAULT true,
    display_order integer DEFAULT 0
);


--
-- TOC entry 247 (class 1259 OID 76951)
-- Name: packages_landing_partners_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.packages_landing_partners_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5228 (class 0 OID 0)
-- Dependencies: 247
-- Name: packages_landing_partners_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.packages_landing_partners_id_seq OWNED BY public.packages_landing_partners.id;


--
-- TOC entry 244 (class 1259 OID 76920)
-- Name: packages_landing_popular; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.packages_landing_popular (
    id integer NOT NULL,
    name character varying(150) NOT NULL,
    tagline character varying(255),
    tests_included_summary text,
    price integer,
    original_price integer,
    labs_count integer,
    savings_badge character varying(50),
    image_url character varying(255),
    is_premium boolean DEFAULT false,
    is_active boolean DEFAULT true,
    display_order integer DEFAULT 0,
    package_id integer
);


--
-- TOC entry 243 (class 1259 OID 76919)
-- Name: packages_landing_popular_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.packages_landing_popular_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5229 (class 0 OID 0)
-- Dependencies: 243
-- Name: packages_landing_popular_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.packages_landing_popular_id_seq OWNED BY public.packages_landing_popular.id;


--
-- TOC entry 256 (class 1259 OID 77000)
-- Name: packages_listing_faqs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.packages_listing_faqs (
    id integer NOT NULL,
    category character varying(100) NOT NULL,
    question text NOT NULL,
    answer text NOT NULL,
    display_order integer DEFAULT 0
);


--
-- TOC entry 255 (class 1259 OID 76999)
-- Name: packages_listing_faqs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.packages_listing_faqs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5230 (class 0 OID 0)
-- Dependencies: 255
-- Name: packages_listing_faqs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.packages_listing_faqs_id_seq OWNED BY public.packages_listing_faqs.id;


--
-- TOC entry 254 (class 1259 OID 76988)
-- Name: packages_listing_guides; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.packages_listing_guides (
    id integer NOT NULL,
    category character varying(100) NOT NULL,
    title character varying(150) NOT NULL,
    description text NOT NULL,
    icon character varying(50) NOT NULL,
    display_order integer DEFAULT 0
);


--
-- TOC entry 253 (class 1259 OID 76987)
-- Name: packages_listing_guides_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.packages_listing_guides_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5231 (class 0 OID 0)
-- Dependencies: 253
-- Name: packages_listing_guides_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.packages_listing_guides_id_seq OWNED BY public.packages_listing_guides.id;


--
-- TOC entry 250 (class 1259 OID 76963)
-- Name: packages_listing_hero_metadata; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.packages_listing_hero_metadata (
    id integer NOT NULL,
    category character varying(100) NOT NULL,
    title character varying(150) NOT NULL,
    subtitle text NOT NULL,
    tags text[] DEFAULT '{}'::text[],
    read_more text,
    image_url character varying(255),
    trust_badges jsonb DEFAULT '[]'::jsonb
);


--
-- TOC entry 249 (class 1259 OID 76962)
-- Name: packages_listing_hero_metadata_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.packages_listing_hero_metadata_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5232 (class 0 OID 0)
-- Dependencies: 249
-- Name: packages_listing_hero_metadata_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.packages_listing_hero_metadata_id_seq OWNED BY public.packages_listing_hero_metadata.id;


--
-- TOC entry 252 (class 1259 OID 76976)
-- Name: packages_listing_tiers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.packages_listing_tiers (
    id integer NOT NULL,
    category character varying(100) NOT NULL,
    tier_name character varying(100) NOT NULL,
    subtitle character varying(255) NOT NULL,
    icon character varying(50) NOT NULL,
    price integer NOT NULL,
    display_order integer DEFAULT 0
);


--
-- TOC entry 251 (class 1259 OID 76975)
-- Name: packages_listing_tiers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.packages_listing_tiers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5233 (class 0 OID 0)
-- Dependencies: 251
-- Name: packages_listing_tiers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.packages_listing_tiers_id_seq OWNED BY public.packages_listing_tiers.id;


--
-- TOC entry 230 (class 1259 OID 60571)
-- Name: reports; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reports (
    id integer NOT NULL,
    user_id integer,
    booking_id integer,
    report_url character varying(255),
    result_summary text,
    date_generated date
);


--
-- TOC entry 229 (class 1259 OID 60570)
-- Name: reports_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.reports_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5234 (class 0 OID 0)
-- Dependencies: 229
-- Name: reports_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.reports_id_seq OWNED BY public.reports.id;


--
-- TOC entry 220 (class 1259 OID 60471)
-- Name: tests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tests (
    id integer NOT NULL,
    name character varying(100),
    lab character varying(100),
    loc character varying(100),
    latitude numeric(10,7),
    longitude numeric(10,7),
    description text,
    rep character varying(50),
    price integer,
    cat character varying(50),
    ok boolean DEFAULT true,
    samples_required character varying(150),
    preparations text,
    why_booked jsonb,
    what_it_measures jsonb,
    test_includes text[],
    short_description character varying(300),
    faq jsonb
);


--
-- TOC entry 219 (class 1259 OID 60470)
-- Name: tests_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5235 (class 0 OID 0)
-- Dependencies: 219
-- Name: tests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tests_id_seq OWNED BY public.tests.id;


--
-- TOC entry 218 (class 1259 OID 60459)
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(100),
    email character varying(100),
    phone character varying(20),
    password character varying(100),
    role character varying(20) DEFAULT 'user'::character varying,
    is_active boolean DEFAULT true,
    last_login timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- TOC entry 217 (class 1259 OID 60458)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5236 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4863 (class 2604 OID 60544)
-- Name: bookings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings ALTER COLUMN id SET DEFAULT nextval('public.bookings_id_seq'::regclass);


--
-- TOC entry 4876 (class 2604 OID 76868)
-- Name: categories_metadata id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories_metadata ALTER COLUMN id SET DEFAULT nextval('public.categories_metadata_id_seq'::regclass);


--
-- TOC entry 4917 (class 2604 OID 77131)
-- Name: category_previews id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.category_previews ALTER COLUMN id SET DEFAULT nextval('public.category_previews_id_seq'::regclass);


--
-- TOC entry 4855 (class 2604 OID 60499)
-- Name: lab_branches id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lab_branches ALTER COLUMN id SET DEFAULT nextval('public.lab_branches_id_seq'::regclass);


--
-- TOC entry 4871 (class 2604 OID 60626)
-- Name: lab_package_branches id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lab_package_branches ALTER COLUMN id SET DEFAULT nextval('public.lab_package_branches_id_seq'::regclass);


--
-- TOC entry 4882 (class 2604 OID 76884)
-- Name: lab_profiles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lab_profiles ALTER COLUMN id SET DEFAULT nextval('public.lab_profiles_id_seq'::regclass);


--
-- TOC entry 4859 (class 2604 OID 60518)
-- Name: lab_test_branches id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lab_test_branches ALTER COLUMN id SET DEFAULT nextval('public.lab_test_branches_id_seq'::regclass);


--
-- TOC entry 4848 (class 2604 OID 60484)
-- Name: labs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.labs ALTER COLUMN id SET DEFAULT nextval('public.labs_id_seq'::regclass);


--
-- TOC entry 4870 (class 2604 OID 60607)
-- Name: package_tests id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.package_tests ALTER COLUMN id SET DEFAULT nextval('public.package_tests_id_seq'::regclass);


--
-- TOC entry 4866 (class 2604 OID 60593)
-- Name: packages id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.packages ALTER COLUMN id SET DEFAULT nextval('public.packages_id_seq'::regclass);


--
-- TOC entry 4895 (class 2604 OID 76912)
-- Name: packages_landing_categories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.packages_landing_categories ALTER COLUMN id SET DEFAULT nextval('public.packages_landing_categories_id_seq'::regclass);


--
-- TOC entry 4902 (class 2604 OID 76942)
-- Name: packages_landing_faqs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.packages_landing_faqs ALTER COLUMN id SET DEFAULT nextval('public.packages_landing_faqs_id_seq'::regclass);


--
-- TOC entry 4905 (class 2604 OID 76955)
-- Name: packages_landing_partners id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.packages_landing_partners ALTER COLUMN id SET DEFAULT nextval('public.packages_landing_partners_id_seq'::regclass);


--
-- TOC entry 4898 (class 2604 OID 76923)
-- Name: packages_landing_popular id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.packages_landing_popular ALTER COLUMN id SET DEFAULT nextval('public.packages_landing_popular_id_seq'::regclass);


--
-- TOC entry 4915 (class 2604 OID 77003)
-- Name: packages_listing_faqs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.packages_listing_faqs ALTER COLUMN id SET DEFAULT nextval('public.packages_listing_faqs_id_seq'::regclass);


--
-- TOC entry 4913 (class 2604 OID 76991)
-- Name: packages_listing_guides id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.packages_listing_guides ALTER COLUMN id SET DEFAULT nextval('public.packages_listing_guides_id_seq'::regclass);


--
-- TOC entry 4908 (class 2604 OID 76966)
-- Name: packages_listing_hero_metadata id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.packages_listing_hero_metadata ALTER COLUMN id SET DEFAULT nextval('public.packages_listing_hero_metadata_id_seq'::regclass);


--
-- TOC entry 4911 (class 2604 OID 76979)
-- Name: packages_listing_tiers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.packages_listing_tiers ALTER COLUMN id SET DEFAULT nextval('public.packages_listing_tiers_id_seq'::regclass);


--
-- TOC entry 4865 (class 2604 OID 60574)
-- Name: reports id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reports ALTER COLUMN id SET DEFAULT nextval('public.reports_id_seq'::regclass);


--
-- TOC entry 4846 (class 2604 OID 60474)
-- Name: tests id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tests ALTER COLUMN id SET DEFAULT nextval('public.tests_id_seq'::regclass);


--
-- TOC entry 4842 (class 2604 OID 60462)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 5179 (class 0 OID 60541)
-- Dependencies: 228
-- Data for Name: bookings; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 5189 (class 0 OID 76865)
-- Dependencies: 238
-- Data for Name: categories_metadata; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.categories_metadata VALUES (3, 'Thyroid', 'bubble_chart', 'Thyroid tests evaluate T3, T4, and TSH levels to identify hypo or hyperthyroidism.', 'Thyroid tests evaluate T3, T4, and TSH levels to identify hypo or hyperthyroidism. Essential for managing metabolism, weight, and energy levels. Regular checks help doctors tailor hormone replacement therapies and detect thyroiditis early.', true, '120+ certified labs', '15k+ monthly bookings', '78k+ patients', '{"TSH Test","T3 / T4","Thyroid Profile",Anti-TPO}');
INSERT INTO public.categories_metadata VALUES (4, 'Diabetes', 'water_drop', 'Diabetes diagnostics track blood glucose and HbA1c levels for early detection and ongoing management.', 'Diabetes diagnostics track blood glucose and HbA1c levels for early detection and ongoing management of Type 1, Type 2, and gestational diabetes. Maintaining optimal glycemic control is vital to avoid long-term renal, cardiovascular, and ophthalmic complications. Includes HbA1c (3-month average), Fasting Blood Glucose, and Post-Prandial checks.', true, '150+ certified labs', '20k+ monthly bookings', '98k+ patients', '{HbA1c,"Fasting Sugar",PPBS,"Insulin Test"}');
INSERT INTO public.categories_metadata VALUES (5, 'Pregnancy', 'pregnant_woman', 'Prenatal and maternal health panels monitor foetal development and pregnancy-related risks.', 'Prenatal and maternal health panels monitor foetal development, hormonal shifts, and pregnancy-related risks throughout each trimester. Provides peace of mind for expecting mothers through quantitative Beta HCG screening, dual/quadruple prenatal markers, and gestational diabetes glucose screenings.', true, '84+ certified labs', '5k+ monthly bookings', '22k+ patients', '{"HCG Test","Dual Marker",OGTT,"Maternal Health"}');
INSERT INTO public.categories_metadata VALUES (1, 'Heart', 'favorite', 'Heart-related tests help assess cholesterol levels, cardiac risk, and cardiovascular health.', 'Heart-related tests help assess cholesterol levels, cardiac risk, and cardiovascular health. Regular monitoring is essential for early detection and prevention of conditions such as hypertension, coronary artery disease, and stroke. Our partner certified NABL labs provide gold-standard lipid profiling, apolipoprotein checks, and electrocardiogram (ECG) screening under certified medical supervision.', true, '142+ certified labs', '12k+ monthly bookings', '65k+ patients', '{"Cholesterol Check",ECG,"Cardiac Risk","Preventive Screening"}');
INSERT INTO public.categories_metadata VALUES (2, 'Cancer', 'shield', 'Cancer screening tests detect tumour markers, abnormal cells, and genetic mutations early.', 'Cancer screening tests detect tumour markers, abnormal cells, and genetic mutations early. Early detection significantly improves treatment outcomes, longevity, and survival rates. Certified laboratory networks offer premium clinical tumor marker tests (PSA, CA-125) and specialized cytology checks (Pap Smear) with high diagnostic specificity.', true, '96+ certified labs', '8k+ monthly bookings', '32k+ patients', '{"PSA Test",CA-125,"Tumour Markers","Genetic Screening"}');
INSERT INTO public.categories_metadata VALUES (8, 'DNA Test', 'dna', 'DNA and genetic tests uncover hereditary disease risks and personalised wellness insights.', 'DNA and genetic tests uncover hereditary disease risks, carrier status, and personalised wellness insights based on your unique genetic profile. Modern molecular sequencing charts a clear path for preventative living, nutritional planning, and early genetic awareness.', true, '45+ certified labs', '2k+ monthly bookings', '10k+ patients', '{"Carrier Status","BRCA Gene","Wellness DNA","Hereditary Risk"}');
INSERT INTO public.categories_metadata VALUES (6, 'Allergy/Intolerance', 'coronavirus', 'Allergy panels identify IgE-mediated responses, sensitivities, and environmental triggers.', 'Allergy and intolerance panels identify IgE-mediated responses, food sensitivities, and environmental triggers affecting your daily quality of life. From chronic sinus issues to dietary discomfort, comprehensive antibody profiles isolate exact reaction causes.', true, '72+ certified labs', '3k+ monthly bookings', '14k+ patients', '{"IgE Total","Food Panel",Respiratory,"Skin Allergy"}');
INSERT INTO public.categories_metadata VALUES (7, 'Hormone', 'bolt', 'Hormone panel tests measure testosterone, estrogen, prolactin, FSH, and LH.', 'Hormone panel tests measure testosterone, estrogen, prolactin, FSH, and LH to assess fertility, hormonal balance, thyroid interactions, and general endocrine health. Essential for tracking reproductive vitality and unexplained energy or mood shifts.', true, '90+ certified labs', '6k+ monthly bookings', '28k+ patients', '{Testosterone,Prolactin,"FSH / LH",DHEA-S}');


--
-- TOC entry 5209 (class 0 OID 77128)
-- Dependencies: 258
-- Data for Name: category_previews; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.category_previews VALUES (1, 'Heart', 90, NULL, false, 0);
INSERT INTO public.category_previews VALUES (2, 'Heart', 150, NULL, false, 1);
INSERT INTO public.category_previews VALUES (3, 'Heart', 151, NULL, false, 2);
INSERT INTO public.category_previews VALUES (4, 'Heart', 160, NULL, false, 3);
INSERT INTO public.category_previews VALUES (5, 'Heart', 161, NULL, false, 4);
INSERT INTO public.category_previews VALUES (6, 'Heart', 162, NULL, false, 5);
INSERT INTO public.category_previews VALUES (7, 'Heart', 163, NULL, false, 6);
INSERT INTO public.category_previews VALUES (8, 'Heart', 164, NULL, false, 7);
INSERT INTO public.category_previews VALUES (9, 'Heart', 165, NULL, false, 8);
INSERT INTO public.category_previews VALUES (10, 'Heart', 166, NULL, false, 9);
INSERT INTO public.category_previews VALUES (11, 'Cancer', 115, NULL, false, 10);
INSERT INTO public.category_previews VALUES (12, 'Cancer', 152, NULL, false, 11);
INSERT INTO public.category_previews VALUES (13, 'Cancer', 153, NULL, false, 12);
INSERT INTO public.category_previews VALUES (14, 'Thyroid', 16, NULL, false, 13);
INSERT INTO public.category_previews VALUES (15, 'Thyroid', 16, NULL, false, 14);
INSERT INTO public.category_previews VALUES (16, 'Diabetes', 20, NULL, false, 15);
INSERT INTO public.category_previews VALUES (17, 'Diabetes', 96, NULL, false, 16);
INSERT INTO public.category_previews VALUES (18, 'Diabetes', 154, NULL, false, 17);
INSERT INTO public.category_previews VALUES (19, 'Diabetes', 167, NULL, false, 18);
INSERT INTO public.category_previews VALUES (20, 'Diabetes', 168, NULL, false, 19);
INSERT INTO public.category_previews VALUES (21, 'Diabetes', 169, NULL, false, 20);
INSERT INTO public.category_previews VALUES (22, 'Diabetes', 170, NULL, false, 21);
INSERT INTO public.category_previews VALUES (23, 'Diabetes', 171, NULL, false, 22);
INSERT INTO public.category_previews VALUES (24, 'Diabetes', 172, NULL, false, 23);
INSERT INTO public.category_previews VALUES (25, 'Pregnancy', 155, NULL, false, 24);
INSERT INTO public.category_previews VALUES (26, 'Pregnancy', 156, NULL, false, 25);
INSERT INTO public.category_previews VALUES (27, 'Allergy/Intolerance', 173, NULL, false, 26);
INSERT INTO public.category_previews VALUES (28, 'Allergy/Intolerance', 157, NULL, false, 27);
INSERT INTO public.category_previews VALUES (29, 'Hormone', 86, NULL, false, 28);
INSERT INTO public.category_previews VALUES (30, 'Hormone', 117, NULL, false, 29);
INSERT INTO public.category_previews VALUES (31, 'DNA Test', 158, NULL, false, 30);
INSERT INTO public.category_previews VALUES (32, 'DNA Test', 159, NULL, false, 31);
INSERT INTO public.category_previews VALUES (33, 'Full Body Checkup', NULL, 1, true, 32);
INSERT INTO public.category_previews VALUES (34, 'Full Body Checkup', NULL, 126, true, 33);


--
-- TOC entry 5175 (class 0 OID 60496)
-- Dependencies: 224
-- Data for Name: lab_branches; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.lab_branches VALUES (1, 1, 'Dwarka', 'Dwarka Branch, Dwarka, Delhi', 'Delhi', 'Delhi', '110001', 28.59210000, 77.04600000, '011-2319-8609', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (2, 1, 'Rohini', 'Rohini Branch, Rohini, Delhi', 'Delhi', 'Delhi', '110001', 28.70410000, 77.10250000, '011-2319-8609', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (3, 1, 'Sarita Vihar', 'Sarita Vihar Branch, Sarita Vihar, Delhi', 'Delhi', 'Delhi', '110001', 28.52860000, 77.28830000, '011-2319-8609', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (4, 1, 'Vasant Kunj', 'Vasant Kunj Branch, Vasant Kunj, Delhi', 'Delhi', 'Delhi', '110001', 28.52000000, 77.15870000, '011-2319-8609', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (5, 2, 'Rohini', 'Rohini Branch, Rohini, Delhi', 'Delhi', 'Delhi', '110001', 28.70410000, 77.10250000, '011-8623-8808', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (6, 3, 'Connaught Place', 'Connaught Place Branch, Connaught Place, Delhi', 'Delhi', 'Delhi', '110001', 28.63150000, 77.21670000, '011-6454-9187', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (7, 3, 'Greater Kailash', 'Greater Kailash Branch, Greater Kailash, Delhi', 'Delhi', 'Delhi', '110001', 28.54840000, 77.24280000, '011-6454-9187', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (8, 3, 'Janakpuri', 'Janakpuri Branch, Janakpuri, Delhi', 'Delhi', 'Delhi', '110001', 28.62190000, 77.08780000, '011-6454-9187', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (9, 3, 'Saket', 'Saket Branch, Saket, Delhi', 'Delhi', 'Delhi', '110001', 28.52450000, 77.20660000, '011-6454-9187', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (10, 4, 'Connaught Place', 'Connaught Place Branch, Connaught Place, Delhi', 'Delhi', 'Delhi', '110001', 28.63150000, 77.21670000, '011-2540-9936', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (11, 4, 'Janakpuri', 'Janakpuri Branch, Janakpuri, Delhi', 'Delhi', 'Delhi', '110001', 28.62190000, 77.08780000, '011-2540-9936', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (12, 4, 'Saket', 'Saket Branch, Saket, Delhi', 'Delhi', 'Delhi', '110001', 28.52450000, 77.20660000, '011-2540-9936', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (13, 4, 'Tilak Nagar', 'Tilak Nagar Branch, Tilak Nagar, Delhi', 'Delhi', 'Delhi', '110001', 28.63650000, 77.09670000, '011-2540-9936', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (14, 4, 'Vikas Puri', 'Vikas Puri Branch, Vikas Puri, Delhi', 'Delhi', 'Delhi', '110001', 28.63880000, 77.07040000, '011-2540-9936', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (15, 5, 'Pitampura', 'Pitampura Branch, Pitampura, Delhi', 'Delhi', 'Delhi', '110001', 28.69900000, 77.13840000, '011-3503-7138', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (16, 6, 'Connaught Place', 'Connaught Place Branch, Connaught Place, Delhi', 'Delhi', 'Delhi', '110001', 28.63150000, 77.21670000, '011-3402-7789', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (17, 6, 'Janakpuri', 'Janakpuri Branch, Janakpuri, Delhi', 'Delhi', 'Delhi', '110001', 28.62190000, 77.08780000, '011-3402-7789', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (18, 6, 'Pitampura', 'Pitampura Branch, Pitampura, Delhi', 'Delhi', 'Delhi', '110001', 28.69900000, 77.13840000, '011-3402-7789', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (19, 6, 'SDA', 'SDA Branch, SDA, Delhi', 'Delhi', 'Delhi', '110001', 28.54780000, 77.20010000, '011-3402-7789', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (20, 7, 'Saket', 'Saket Branch, Saket, Delhi', 'Delhi', 'Delhi', '110001', 28.52450000, 77.20660000, '011-1829-4652', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (21, 8, 'Preet Vihar', 'Preet Vihar Branch, Preet Vihar, Delhi', 'Delhi', 'Delhi', '110001', 28.64150000, 77.29510000, '011-4647-9492', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (22, 8, 'Rohini', 'Rohini Branch, Rohini, Delhi', 'Delhi', 'Delhi', '110001', 28.70410000, 77.10250000, '011-4647-9492', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (23, 8, 'Vasant Kunj', 'Vasant Kunj Branch, Vasant Kunj, Delhi', 'Delhi', 'Delhi', '110001', 28.52000000, 77.15870000, '011-4647-9492', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (24, 9, 'Vasant Kunj', 'Vasant Kunj Branch, Vasant Kunj, Delhi', 'Delhi', 'Delhi', '110001', 28.52000000, 77.15870000, '011-1646-3189', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (25, 10, 'Green Park', 'Green Park Branch, Green Park, Delhi', 'Delhi', 'Delhi', '110001', 28.55820000, 77.20280000, '011-9089-2740', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (26, 10, 'Rohini', 'Rohini Branch, Rohini, Delhi', 'Delhi', 'Delhi', '110001', 28.70410000, 77.10250000, '011-9089-2740', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (27, 10, 'Vasant Kunj', 'Vasant Kunj Branch, Vasant Kunj, Delhi', 'Delhi', 'Delhi', '110001', 28.52000000, 77.15870000, '011-9089-2740', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (28, 11, 'Shalimar Bagh', 'Shalimar Bagh Branch, Shalimar Bagh, Delhi', 'Delhi', 'Delhi', '110001', 28.71640000, 77.15630000, '011-5020-5991', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (29, 12, 'Dwarka', 'Dwarka Branch, Dwarka, Delhi', 'Delhi', 'Delhi', '110001', 28.59210000, 77.04600000, '011-7591-2703', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (30, 12, 'Laxmi Nagar', 'Laxmi Nagar Branch, Laxmi Nagar, Delhi', 'Delhi', 'Delhi', '110001', 28.63040000, 77.27740000, '011-7591-2703', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (31, 12, 'Rohini', 'Rohini Branch, Rohini, Delhi', 'Delhi', 'Delhi', '110001', 28.70410000, 77.10250000, '011-7591-2703', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (32, 13, 'Laxmi Nagar', 'Laxmi Nagar Branch, Laxmi Nagar, Delhi', 'Delhi', 'Delhi', '110001', 28.63040000, 77.27740000, '011-6109-3205', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (33, 14, 'Connaught Place', 'Connaught Place Branch, Connaught Place, Delhi', 'Delhi', 'Delhi', '110001', 28.63150000, 77.21670000, '011-5365-8476', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (34, 14, 'Pitampura', 'Pitampura Branch, Pitampura, Delhi', 'Delhi', 'Delhi', '110001', 28.69900000, 77.13840000, '011-5365-8476', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (35, 14, 'Saket', 'Saket Branch, Saket, Delhi', 'Delhi', 'Delhi', '110001', 28.52450000, 77.20660000, '011-5365-8476', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (36, 14, 'Vasant Kunj', 'Vasant Kunj Branch, Vasant Kunj, Delhi', 'Delhi', 'Delhi', '110001', 28.52000000, 77.15870000, '011-5365-8476', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (37, 15, 'Janakpuri', 'Janakpuri Branch, Janakpuri, Delhi', 'Delhi', 'Delhi', '110001', 28.62190000, 77.08780000, '011-1220-1406', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (38, 16, 'Janakpuri', 'Janakpuri Branch, Janakpuri, Delhi', 'Delhi', 'Delhi', '110001', 28.62190000, 77.08780000, '011-8520-2187', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (39, 16, 'Karkardooma', 'Karkardooma Branch, Karkardooma, Delhi', 'Delhi', 'Delhi', '110001', 28.64870000, 77.30570000, '011-8520-2187', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (40, 16, 'Pitampura', 'Pitampura Branch, Pitampura, Delhi', 'Delhi', 'Delhi', '110001', 28.69900000, 77.13840000, '011-8520-2187', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (41, 16, 'Saket', 'Saket Branch, Saket, Delhi', 'Delhi', 'Delhi', '110001', 28.52450000, 77.20660000, '011-8520-2187', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (42, 17, 'Defence Colony', 'Defence Colony Branch, Defence Colony, Delhi', 'Delhi', 'Delhi', '110001', 28.57180000, 77.23200000, '011-6926-4309', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (43, 17, 'Janakpuri', 'Janakpuri Branch, Janakpuri, Delhi', 'Delhi', 'Delhi', '110001', 28.62190000, 77.08780000, '011-6926-4309', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (44, 17, 'Pitampura', 'Pitampura Branch, Pitampura, Delhi', 'Delhi', 'Delhi', '110001', 28.69900000, 77.13840000, '011-6926-4309', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (45, 17, 'Saket', 'Saket Branch, Saket, Delhi', 'Delhi', 'Delhi', '110001', 28.52450000, 77.20660000, '011-6926-4309', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (46, 17, 'South Extension', 'South Extension Branch, South Extension, Delhi', 'Delhi', 'Delhi', '110001', 28.56870000, 77.22090000, '011-6926-4309', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (47, 18, 'Janakpuri', 'Janakpuri Branch, Janakpuri, Delhi', 'Delhi', 'Delhi', '110001', 28.62190000, 77.08780000, '011-7709-8031', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (48, 18, 'Patparganj', 'Patparganj Branch, Patparganj, Delhi', 'Delhi', 'Delhi', '110001', 28.61730000, 77.29310000, '011-7709-8031', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (49, 18, 'Pitampura', 'Pitampura Branch, Pitampura, Delhi', 'Delhi', 'Delhi', '110001', 28.69900000, 77.13840000, '011-7709-8031', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (50, 18, 'Saket', 'Saket Branch, Saket, Delhi', 'Delhi', 'Delhi', '110001', 28.52450000, 77.20660000, '011-7709-8031', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (51, 19, 'Connaught Place', 'Connaught Place Branch, Connaught Place, Delhi', 'Delhi', 'Delhi', '110001', 28.63150000, 77.21670000, '011-4762-3857', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (52, 20, 'Connaught Place', 'Connaught Place Branch, Connaught Place, Delhi', 'Delhi', 'Delhi', '110001', 28.63150000, 77.21670000, '011-7859-9260', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (53, 20, 'Pitampura', 'Pitampura Branch, Pitampura, Delhi', 'Delhi', 'Delhi', '110001', 28.69900000, 77.13840000, '011-7859-9260', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (54, 20, 'Punjabi Bagh', 'Punjabi Bagh Branch, Punjabi Bagh, Delhi', 'Delhi', 'Delhi', '110001', 28.66890000, 77.13250000, '011-7859-9260', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (55, 20, 'Saket', 'Saket Branch, Saket, Delhi', 'Delhi', 'Delhi', '110001', 28.52450000, 77.20660000, '011-7859-9260', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (56, 21, 'Dwarka', 'Dwarka Branch, Dwarka, Delhi', 'Delhi', 'Delhi', '110001', 28.59210000, 77.04600000, '011-1853-5476', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (57, 21, 'Laxmi Nagar', 'Laxmi Nagar Branch, Laxmi Nagar, Delhi', 'Delhi', 'Delhi', '110001', 28.63040000, 77.27740000, '011-1853-5476', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (58, 22, 'Janakpuri', 'Janakpuri Branch, Janakpuri, Delhi', 'Delhi', 'Delhi', '110001', 28.62190000, 77.08780000, '011-4451-5861', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (59, 22, 'Rohini', 'Rohini Branch, Rohini, Delhi', 'Delhi', 'Delhi', '110001', 28.70410000, 77.10250000, '011-4451-5861', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (60, 22, 'Vasant Kunj', 'Vasant Kunj Branch, Vasant Kunj, Delhi', 'Delhi', 'Delhi', '110001', 28.52000000, 77.15870000, '011-4451-5861', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (61, 23, 'Vasant Kunj', 'Vasant Kunj Branch, Vasant Kunj, Delhi', 'Delhi', 'Delhi', '110001', 28.52000000, 77.15870000, '011-4822-3643', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (62, 24, 'Dwarka', 'Dwarka Branch, Dwarka, Delhi', 'Delhi', 'Delhi', '110001', 28.59210000, 77.04600000, '011-4345-7414', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (63, 24, 'Rohini', 'Rohini Branch, Rohini, Delhi', 'Delhi', 'Delhi', '110001', 28.70410000, 77.10250000, '011-4345-7414', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (64, 24, 'Vasant Kunj', 'Vasant Kunj Branch, Vasant Kunj, Delhi', 'Delhi', 'Delhi', '110001', 28.52000000, 77.15870000, '011-4345-7414', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (65, 25, 'Dwarka', 'Dwarka Branch, Dwarka, Delhi', 'Delhi', 'Delhi', '110001', 28.59210000, 77.04600000, '011-3077-2183', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (66, 25, 'Laxmi Nagar', 'Laxmi Nagar Branch, Laxmi Nagar, Delhi', 'Delhi', 'Delhi', '110001', 28.63040000, 77.27740000, '011-3077-2183', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (67, 25, 'Okhla', 'Okhla Branch, Okhla, Delhi', 'Delhi', 'Delhi', '110001', 28.53550000, 77.28680000, '011-3077-2183', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (68, 26, 'Dwarka', 'Dwarka Branch, Dwarka, Delhi', 'Delhi', 'Delhi', '110001', 28.59210000, 77.04600000, '011-1127-9237', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (69, 26, 'Laxmi Nagar', 'Laxmi Nagar Branch, Laxmi Nagar, Delhi', 'Delhi', 'Delhi', '110001', 28.63040000, 77.27740000, '011-1127-9237', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (70, 26, 'Pitampura', 'Pitampura Branch, Pitampura, Delhi', 'Delhi', 'Delhi', '110001', 28.69900000, 77.13840000, '011-1127-9237', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (71, 27, 'Connaught Place', 'Connaught Place Branch, Connaught Place, Delhi', 'Delhi', 'Delhi', '110001', 28.63150000, 77.21670000, '011-6255-9385', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (72, 27, 'Pitampura', 'Pitampura Branch, Pitampura, Delhi', 'Delhi', 'Delhi', '110001', 28.69900000, 77.13840000, '011-6255-9385', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (73, 27, 'Saket', 'Saket Branch, Saket, Delhi', 'Delhi', 'Delhi', '110001', 28.52450000, 77.20660000, '011-6255-9385', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (74, 28, 'Janakpuri', 'Janakpuri Branch, Janakpuri, Delhi', 'Delhi', 'Delhi', '110001', 28.62190000, 77.08780000, '011-1503-3240', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (75, 29, 'Connaught Place', 'Connaught Place Branch, Connaught Place, Delhi', 'Delhi', 'Delhi', '110001', 28.63150000, 77.21670000, '011-1378-8890', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (76, 29, 'Janakpuri', 'Janakpuri Branch, Janakpuri, Delhi', 'Delhi', 'Delhi', '110001', 28.62190000, 77.08780000, '011-1378-8890', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (77, 29, 'Pitampura', 'Pitampura Branch, Pitampura, Delhi', 'Delhi', 'Delhi', '110001', 28.69900000, 77.13840000, '011-1378-8890', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (78, 29, 'Tilak Nagar', 'Tilak Nagar Branch, Tilak Nagar, Delhi', 'Delhi', 'Delhi', '110001', 28.63650000, 77.09670000, '011-1378-8890', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (79, 30, 'Dwarka', 'Dwarka Branch, Dwarka, Delhi', 'Delhi', 'Delhi', '110001', 28.59210000, 77.04600000, '011-7380-3434', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (80, 30, 'Janakpuri', 'Janakpuri Branch, Janakpuri, Delhi', 'Delhi', 'Delhi', '110001', 28.62190000, 77.08780000, '011-7380-3434', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (81, 30, 'Laxmi Nagar', 'Laxmi Nagar Branch, Laxmi Nagar, Delhi', 'Delhi', 'Delhi', '110001', 28.63040000, 77.27740000, '011-7380-3434', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (82, 30, 'Okhla', 'Okhla Branch, Okhla, Delhi', 'Delhi', 'Delhi', '110001', 28.53550000, 77.28680000, '011-7380-3434', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');
INSERT INTO public.lab_branches VALUES (83, 31, 'Dwarka', 'Dwarka Branch, Dwarka, Delhi', 'Delhi', 'Delhi', '110001', 28.59210000, 77.04600000, '011-8065-4333', '9 AM - 6 PM, Mon-Sat', true, true, '2026-05-25 21:24:54.833265');


--
-- TOC entry 5187 (class 0 OID 60623)
-- Dependencies: 236
-- Data for Name: lab_package_branches; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.lab_package_branches VALUES (481, 5, 15, 1, 1299, '48 HR', true, '25% OFF', 'Standard package offered by branch 15', true, '2026-05-28 16:06:53.591241', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (482, 6, 16, 1, 1499, '24 HR', true, '25% OFF', 'Standard package offered by branch 16', true, '2026-05-28 16:06:53.594454', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (555, 3, 6, 115, 2999, '24 HR', true, '25% OFF', 'Standard package offered by branch 6', true, '2026-05-28 16:06:53.752986', 25, 3999);
INSERT INTO public.lab_package_branches VALUES (483, 6, 17, 1, 1699, '48 HR', true, '25% OFF', 'Standard package offered by branch 17', true, '2026-05-28 16:06:53.596984', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (489, 8, 23, 1, 1399, '48 HR', true, '25% OFF', 'Standard package offered by branch 23', true, '2026-05-28 16:06:53.609807', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (490, 9, 24, 1, 1599, '24 HR', true, '25% OFF', 'Standard package offered by branch 24', true, '2026-05-28 16:06:53.613993', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (491, 10, 25, 1, 1299, '48 HR', true, '25% OFF', 'Standard package offered by branch 25', true, '2026-05-28 16:06:53.616095', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (466, 1, 1, 2, 1499, '48 HR', true, '25% OFF', 'Premium health panel mapping.', true, '2026-05-28 16:06:52.830624', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (465, 1, 2, 2, 1699, '24 HR', true, '25% OFF', 'Premium health panel mapping.', true, '2026-05-28 16:06:52.830624', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (464, 1, 3, 2, 1399, '48 HR', true, '25% OFF', 'Premium health panel mapping.', true, '2026-05-28 16:06:52.830624', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (463, 1, 4, 2, 1599, '24 HR', true, '25% OFF', 'Premium health panel mapping.', true, '2026-05-28 16:06:52.830624', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (462, 2, 5, 2, 1299, '48 HR', true, '25% OFF', 'Premium health panel mapping.', true, '2026-05-28 16:06:52.830624', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (1906, 12, 29, 131, 1399, '48 HR', true, '48% OFF', 'Standard package offered by branch 29', true, '2026-05-28 16:06:56.178972', 48, 2691);
INSERT INTO public.lab_package_branches VALUES (473, 3, 7, 1, 1699, '48 HR', true, '25% OFF', 'Standard package offered by branch 7', true, '2026-05-28 16:06:53.5745', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (474, 3, 8, 1, 1399, '24 HR', true, '25% OFF', 'Standard package offered by branch 8', true, '2026-05-28 16:06:53.576282', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (1926, 18, 49, 131, 1399, '48 HR', true, '48% OFF', 'Standard package offered by branch 49', true, '2026-05-28 16:06:56.211427', 48, 2691);
INSERT INTO public.lab_package_branches VALUES (561, 4, 12, 115, 3199, '24 HR', true, '25% OFF', 'Standard package offered by branch 12', true, '2026-05-28 16:06:53.765931', 25, 4266);
INSERT INTO public.lab_package_branches VALUES (492, 10, 26, 1, 1499, '24 HR', true, '25% OFF', 'Standard package offered by branch 26', true, '2026-05-28 16:06:53.618323', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (2, 12, 30, 1, 1299, '24 HR', true, '25% OFF', 'Standard package offered by Ganesh Diagnostic', true, '2026-05-25 21:24:54.864272', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (6, 14, 36, 1, 1499, '24 HR', true, '25% OFF', 'Standard package offered by Healthians', true, '2026-05-25 21:24:54.864272', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (589, 16, 40, 115, 2799, '24 HR', true, '25% OFF', 'Standard package offered by branch 40', true, '2026-05-28 16:06:53.821662', 25, 3732);
INSERT INTO public.lab_package_branches VALUES (620, 27, 71, 115, 2999, '48 HR', true, '25% OFF', 'Standard package offered by branch 71', true, '2026-05-28 16:06:53.884532', 25, 3999);
INSERT INTO public.lab_package_branches VALUES (475, 3, 9, 1, 1599, '48 HR', true, '25% OFF', 'Standard package offered by branch 9', true, '2026-05-28 16:06:53.57826', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (484, 6, 18, 1, 1399, '24 HR', true, '25% OFF', 'Standard package offered by branch 18', true, '2026-05-28 16:06:53.59874', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (485, 6, 19, 1, 1599, '48 HR', true, '25% OFF', 'Standard package offered by branch 19', true, '2026-05-28 16:06:53.600442', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (486, 7, 20, 1, 1299, '24 HR', true, '25% OFF', 'Standard package offered by branch 20', true, '2026-05-28 16:06:53.603082', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (626, 29, 77, 115, 3199, '48 HR', true, '25% OFF', 'Standard package offered by branch 77', true, '2026-05-28 16:06:53.895126', 25, 4266);
INSERT INTO public.lab_package_branches VALUES (476, 4, 10, 1, 1299, '24 HR', true, '25% OFF', 'Standard package offered by branch 10', true, '2026-05-28 16:06:53.580804', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (477, 4, 11, 1, 1499, '48 HR', true, '25% OFF', 'Standard package offered by branch 11', true, '2026-05-28 16:06:53.582657', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (487, 8, 21, 1, 1499, '48 HR', true, '25% OFF', 'Standard package offered by branch 21', true, '2026-05-28 16:06:53.604808', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (522, 21, 56, 1, 1499, '24 HR', true, '25% OFF', 'Standard package offered by branch 56', true, '2026-05-28 16:06:53.67917', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (8, 25, 67, 1, 1699, '48 HR', true, '25% OFF', 'Standard package offered by Redcliffe Labs', true, '2026-05-25 21:24:54.864272', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (1954, 29, 77, 131, 1499, '48 HR', true, '48% OFF', 'Standard package offered by branch 77', true, '2026-05-28 16:06:56.247563', 48, 2883);
INSERT INTO public.lab_package_branches VALUES (460, 1, 2, 1, 1699, '24 HR', true, '25% OFF', 'Premium health panel mapping.', true, '2026-05-28 16:06:52.830624', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (459, 1, 3, 1, 1399, '48 HR', true, '25% OFF', 'Premium health panel mapping.', true, '2026-05-28 16:06:52.830624', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (458, 1, 4, 1, 1599, '24 HR', true, '25% OFF', 'Premium health panel mapping.', true, '2026-05-28 16:06:52.830624', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (478, 4, 12, 1, 1699, '24 HR', true, '25% OFF', 'Standard package offered by branch 12', true, '2026-05-28 16:06:53.584504', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (479, 4, 13, 1, 1399, '48 HR', true, '25% OFF', 'Standard package offered by branch 13', true, '2026-05-28 16:06:53.586899', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (488, 8, 22, 1, 1699, '24 HR', true, '25% OFF', 'Standard package offered by branch 22', true, '2026-05-28 16:06:53.606871', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (480, 4, 14, 1, 1599, '24 HR', true, '25% OFF', 'Standard package offered by branch 14', true, '2026-05-28 16:06:53.588662', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (5, 22, 58, 3, 1399, '24 HR', true, '25% OFF', 'Standard package offered by Pathkind Labs', true, '2026-05-25 21:24:54.864272', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (1, 27, 72, 3, 1699, '24 HR', true, '25% OFF', 'Standard package offered by SRL Diagnostics', true, '2026-05-25 21:24:54.864272', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (1878, 1, 1, 131, 1299, '48 HR', true, '48% OFF', 'Standard package offered by branch 1', true, '2026-05-28 16:06:56.125853', 48, 2499);
INSERT INTO public.lab_package_branches VALUES (457, 2, 5, 1, 1299, '48 HR', true, '25% OFF', 'Premium health panel mapping.', true, '2026-05-28 16:06:52.830624', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (472, 3, 6, 1, 1499, '24 HR', true, '25% OFF', 'Standard package offered by branch 6', true, '2026-05-28 16:06:53.572062', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (3, 8, 22, 2, 1699, '24 HR', true, '25% OFF', 'Standard package offered by Dr. Lal PathLabs', true, '2026-05-25 21:24:54.864272', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (4, 18, 50, 2, 1299, '24 HR', true, '25% OFF', 'Standard package offered by Max Lab', true, '2026-05-25 21:24:54.864272', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (1985, 10, 25, 132, 1099, '48 HR', true, '48% OFF', 'Standard package offered by branch 25', true, '2026-05-28 16:06:56.289612', 48, 2114);
INSERT INTO public.lab_package_branches VALUES (498, 13, 32, 1, 1699, '24 HR', true, '25% OFF', 'Standard package offered by branch 32', true, '2026-05-28 16:06:53.631962', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (499, 14, 33, 1, 1399, '48 HR', true, '25% OFF', 'Standard package offered by branch 33', true, '2026-05-28 16:06:53.634038', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (500, 14, 34, 1, 1599, '24 HR', true, '25% OFF', 'Standard package offered by branch 34', true, '2026-05-28 16:06:53.635495', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (501, 14, 35, 1, 1299, '48 HR', true, '25% OFF', 'Standard package offered by branch 35', true, '2026-05-28 16:06:53.63673', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (503, 15, 37, 1, 1699, '48 HR', true, '25% OFF', 'Standard package offered by branch 37', true, '2026-05-28 16:06:53.64276', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (504, 16, 38, 1, 1399, '24 HR', true, '25% OFF', 'Standard package offered by branch 38', true, '2026-05-28 16:06:53.644527', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (505, 16, 39, 1, 1599, '48 HR', true, '25% OFF', 'Standard package offered by branch 39', true, '2026-05-28 16:06:53.647979', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (506, 16, 40, 1, 1299, '24 HR', true, '25% OFF', 'Standard package offered by branch 40', true, '2026-05-28 16:06:53.649957', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (507, 16, 41, 1, 1499, '48 HR', true, '25% OFF', 'Standard package offered by branch 41', true, '2026-05-28 16:06:53.652051', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (508, 17, 42, 1, 1699, '24 HR', true, '25% OFF', 'Standard package offered by branch 42', true, '2026-05-28 16:06:53.653384', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (509, 17, 43, 1, 1399, '48 HR', true, '25% OFF', 'Standard package offered by branch 43', true, '2026-05-28 16:06:53.654937', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (510, 17, 44, 1, 1599, '24 HR', true, '25% OFF', 'Standard package offered by branch 44', true, '2026-05-28 16:06:53.656438', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (511, 17, 45, 1, 1299, '48 HR', true, '25% OFF', 'Standard package offered by branch 45', true, '2026-05-28 16:06:53.658504', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (512, 17, 46, 1, 1499, '24 HR', true, '25% OFF', 'Standard package offered by branch 46', true, '2026-05-28 16:06:53.660028', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (513, 18, 47, 1, 1699, '48 HR', true, '25% OFF', 'Standard package offered by branch 47', true, '2026-05-28 16:06:53.661818', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (514, 18, 48, 1, 1399, '24 HR', true, '25% OFF', 'Standard package offered by branch 48', true, '2026-05-28 16:06:53.663751', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (515, 18, 49, 1, 1599, '48 HR', true, '25% OFF', 'Standard package offered by branch 49', true, '2026-05-28 16:06:53.665619', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (516, 18, 50, 1, 1299, '24 HR', true, '25% OFF', 'Standard package offered by branch 50', true, '2026-05-28 16:06:53.667146', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (517, 19, 51, 1, 1499, '48 HR', true, '25% OFF', 'Standard package offered by branch 51', true, '2026-05-28 16:06:53.669707', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (518, 20, 52, 1, 1699, '24 HR', true, '25% OFF', 'Standard package offered by branch 52', true, '2026-05-28 16:06:53.671752', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (519, 20, 53, 1, 1399, '48 HR', true, '25% OFF', 'Standard package offered by branch 53', true, '2026-05-28 16:06:53.673631', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (520, 20, 54, 1, 1599, '24 HR', true, '25% OFF', 'Standard package offered by branch 54', true, '2026-05-28 16:06:53.675354', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (521, 20, 55, 1, 1299, '48 HR', true, '25% OFF', 'Standard package offered by branch 55', true, '2026-05-28 16:06:53.677066', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (523, 21, 57, 1, 1699, '48 HR', true, '25% OFF', 'Standard package offered by branch 57', true, '2026-05-28 16:06:53.681251', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (524, 22, 58, 1, 1399, '24 HR', true, '25% OFF', 'Standard package offered by branch 58', true, '2026-05-28 16:06:53.683241', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (525, 22, 59, 1, 1599, '48 HR', true, '25% OFF', 'Standard package offered by branch 59', true, '2026-05-28 16:06:53.686137', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (526, 22, 60, 1, 1299, '24 HR', true, '25% OFF', 'Standard package offered by branch 60', true, '2026-05-28 16:06:53.688389', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (527, 23, 61, 1, 1499, '48 HR', true, '25% OFF', 'Standard package offered by branch 61', true, '2026-05-28 16:06:53.69001', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (528, 24, 62, 1, 1699, '24 HR', true, '25% OFF', 'Standard package offered by branch 62', true, '2026-05-28 16:06:53.69191', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (529, 24, 63, 1, 1399, '48 HR', true, '25% OFF', 'Standard package offered by branch 63', true, '2026-05-28 16:06:53.693654', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (530, 24, 64, 1, 1599, '24 HR', true, '25% OFF', 'Standard package offered by branch 64', true, '2026-05-28 16:06:53.695883', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (531, 25, 65, 1, 1299, '48 HR', true, '25% OFF', 'Standard package offered by branch 65', true, '2026-05-28 16:06:53.697786', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (532, 25, 66, 1, 1499, '24 HR', true, '25% OFF', 'Standard package offered by branch 66', true, '2026-05-28 16:06:53.699611', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (534, 26, 68, 1, 1399, '24 HR', true, '25% OFF', 'Standard package offered by branch 68', true, '2026-05-28 16:06:53.70304', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (535, 26, 69, 1, 1599, '48 HR', true, '25% OFF', 'Standard package offered by branch 69', true, '2026-05-28 16:06:53.704685', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (536, 26, 70, 1, 1299, '24 HR', true, '25% OFF', 'Standard package offered by branch 70', true, '2026-05-28 16:06:53.70634', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (538, 27, 72, 1, 1699, '24 HR', true, '25% OFF', 'Standard package offered by branch 72', true, '2026-05-28 16:06:53.709946', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (539, 27, 73, 1, 1399, '48 HR', true, '25% OFF', 'Standard package offered by branch 73', true, '2026-05-28 16:06:53.712252', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (540, 28, 74, 1, 1599, '24 HR', true, '25% OFF', 'Standard package offered by branch 74', true, '2026-05-28 16:06:53.714085', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (541, 29, 75, 1, 1299, '48 HR', true, '25% OFF', 'Standard package offered by branch 75', true, '2026-05-28 16:06:53.716426', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (542, 29, 76, 1, 1499, '24 HR', true, '25% OFF', 'Standard package offered by branch 76', true, '2026-05-28 16:06:53.718685', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (543, 29, 77, 1, 1699, '48 HR', true, '25% OFF', 'Standard package offered by branch 77', true, '2026-05-28 16:06:53.720493', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (544, 29, 78, 1, 1399, '24 HR', true, '25% OFF', 'Standard package offered by branch 78', true, '2026-05-28 16:06:53.722794', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (545, 30, 79, 1, 1599, '48 HR', true, '25% OFF', 'Standard package offered by branch 79', true, '2026-05-28 16:06:53.725057', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (546, 30, 80, 1, 1299, '24 HR', true, '25% OFF', 'Standard package offered by branch 80', true, '2026-05-28 16:06:53.727778', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (547, 30, 81, 1, 1499, '48 HR', true, '25% OFF', 'Standard package offered by branch 81', true, '2026-05-28 16:06:53.734251', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (548, 30, 82, 1, 1699, '24 HR', true, '25% OFF', 'Standard package offered by branch 82', true, '2026-05-28 16:06:53.736125', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (549, 31, 83, 1, 1399, '48 HR', true, '25% OFF', 'Standard package offered by branch 83', true, '2026-05-28 16:06:53.738709', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (550, 1, 1, 115, 2999, '48 HR', true, '25% OFF', 'Standard package offered by branch 1', true, '2026-05-28 16:06:53.742352', 25, 3999);
INSERT INTO public.lab_package_branches VALUES (551, 1, 2, 115, 3199, '24 HR', true, '25% OFF', 'Standard package offered by branch 2', true, '2026-05-28 16:06:53.744809', 25, 4266);
INSERT INTO public.lab_package_branches VALUES (553, 1, 4, 115, 3099, '24 HR', true, '25% OFF', 'Standard package offered by branch 4', true, '2026-05-28 16:06:53.748828', 25, 4132);
INSERT INTO public.lab_package_branches VALUES (554, 2, 5, 115, 2799, '48 HR', true, '25% OFF', 'Standard package offered by branch 5', true, '2026-05-28 16:06:53.750815', 25, 3732);
INSERT INTO public.lab_package_branches VALUES (556, 3, 7, 115, 3199, '48 HR', true, '25% OFF', 'Standard package offered by branch 7', true, '2026-05-28 16:06:53.755259', 25, 4266);
INSERT INTO public.lab_package_branches VALUES (557, 3, 8, 115, 2899, '24 HR', true, '25% OFF', 'Standard package offered by branch 8', true, '2026-05-28 16:06:53.75734', 25, 3866);
INSERT INTO public.lab_package_branches VALUES (558, 3, 9, 115, 3099, '48 HR', true, '25% OFF', 'Standard package offered by branch 9', true, '2026-05-28 16:06:53.759779', 25, 4132);
INSERT INTO public.lab_package_branches VALUES (559, 4, 10, 115, 2799, '24 HR', true, '25% OFF', 'Standard package offered by branch 10', true, '2026-05-28 16:06:53.762112', 25, 3732);
INSERT INTO public.lab_package_branches VALUES (560, 4, 11, 115, 2999, '48 HR', true, '25% OFF', 'Standard package offered by branch 11', true, '2026-05-28 16:06:53.764124', 25, 3999);
INSERT INTO public.lab_package_branches VALUES (493, 10, 27, 1, 1699, '48 HR', true, '25% OFF', 'Standard package offered by branch 27', true, '2026-05-28 16:06:53.620818', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (494, 11, 28, 1, 1399, '24 HR', true, '25% OFF', 'Standard package offered by branch 28', true, '2026-05-28 16:06:53.622415', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (495, 12, 29, 1, 1599, '48 HR', true, '25% OFF', 'Standard package offered by branch 29', true, '2026-05-28 16:06:53.624918', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (552, 1, 3, 115, 2899, '48 HR', true, '25% OFF', 'Standard package offered by branch 3', true, '2026-05-28 16:06:53.746646', 25, 3866);
INSERT INTO public.lab_package_branches VALUES (497, 12, 31, 1, 1499, '48 HR', true, '25% OFF', 'Standard package offered by branch 31', true, '2026-05-28 16:06:53.629432', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (566, 6, 17, 115, 3199, '48 HR', true, '25% OFF', 'Standard package offered by branch 17', true, '2026-05-28 16:06:53.778258', 25, 4266);
INSERT INTO public.lab_package_branches VALUES (567, 6, 18, 115, 2899, '24 HR', true, '25% OFF', 'Standard package offered by branch 18', true, '2026-05-28 16:06:53.780266', 25, 3866);
INSERT INTO public.lab_package_branches VALUES (568, 6, 19, 115, 3099, '48 HR', true, '25% OFF', 'Standard package offered by branch 19', true, '2026-05-28 16:06:53.782398', 25, 4132);
INSERT INTO public.lab_package_branches VALUES (569, 7, 20, 115, 2799, '24 HR', true, '25% OFF', 'Standard package offered by branch 20', true, '2026-05-28 16:06:53.784755', 25, 3732);
INSERT INTO public.lab_package_branches VALUES (570, 8, 21, 115, 2999, '48 HR', true, '25% OFF', 'Standard package offered by branch 21', true, '2026-05-28 16:06:53.786626', 25, 3999);
INSERT INTO public.lab_package_branches VALUES (571, 8, 22, 115, 3199, '24 HR', true, '25% OFF', 'Standard package offered by branch 22', true, '2026-05-28 16:06:53.788607', 25, 4266);
INSERT INTO public.lab_package_branches VALUES (572, 8, 23, 115, 2899, '48 HR', true, '25% OFF', 'Standard package offered by branch 23', true, '2026-05-28 16:06:53.790577', 25, 3866);
INSERT INTO public.lab_package_branches VALUES (573, 9, 24, 115, 3099, '24 HR', true, '25% OFF', 'Standard package offered by branch 24', true, '2026-05-28 16:06:53.792246', 25, 4132);
INSERT INTO public.lab_package_branches VALUES (574, 10, 25, 115, 2799, '48 HR', true, '25% OFF', 'Standard package offered by branch 25', true, '2026-05-28 16:06:53.793855', 25, 3732);
INSERT INTO public.lab_package_branches VALUES (575, 10, 26, 115, 2999, '24 HR', true, '25% OFF', 'Standard package offered by branch 26', true, '2026-05-28 16:06:53.795627', 25, 3999);
INSERT INTO public.lab_package_branches VALUES (576, 10, 27, 115, 3199, '48 HR', true, '25% OFF', 'Standard package offered by branch 27', true, '2026-05-28 16:06:53.79768', 25, 4266);
INSERT INTO public.lab_package_branches VALUES (577, 11, 28, 115, 2899, '24 HR', true, '25% OFF', 'Standard package offered by branch 28', true, '2026-05-28 16:06:53.800023', 25, 3866);
INSERT INTO public.lab_package_branches VALUES (578, 12, 29, 115, 3099, '48 HR', true, '25% OFF', 'Standard package offered by branch 29', true, '2026-05-28 16:06:53.801508', 25, 4132);
INSERT INTO public.lab_package_branches VALUES (579, 12, 30, 115, 2799, '24 HR', true, '25% OFF', 'Standard package offered by branch 30', true, '2026-05-28 16:06:53.803589', 25, 3732);
INSERT INTO public.lab_package_branches VALUES (580, 12, 31, 115, 2999, '48 HR', true, '25% OFF', 'Standard package offered by branch 31', true, '2026-05-28 16:06:53.805066', 25, 3999);
INSERT INTO public.lab_package_branches VALUES (581, 13, 32, 115, 3199, '24 HR', true, '25% OFF', 'Standard package offered by branch 32', true, '2026-05-28 16:06:53.806513', 25, 4266);
INSERT INTO public.lab_package_branches VALUES (582, 14, 33, 115, 2899, '48 HR', true, '25% OFF', 'Standard package offered by branch 33', true, '2026-05-28 16:06:53.808243', 25, 3866);
INSERT INTO public.lab_package_branches VALUES (583, 14, 34, 115, 3099, '24 HR', true, '25% OFF', 'Standard package offered by branch 34', true, '2026-05-28 16:06:53.809858', 25, 4132);
INSERT INTO public.lab_package_branches VALUES (584, 14, 35, 115, 2799, '48 HR', true, '25% OFF', 'Standard package offered by branch 35', true, '2026-05-28 16:06:53.811615', 25, 3732);
INSERT INTO public.lab_package_branches VALUES (585, 14, 36, 115, 2999, '24 HR', true, '25% OFF', 'Standard package offered by branch 36', true, '2026-05-28 16:06:53.813533', 25, 3999);
INSERT INTO public.lab_package_branches VALUES (586, 15, 37, 115, 3199, '48 HR', true, '25% OFF', 'Standard package offered by branch 37', true, '2026-05-28 16:06:53.81539', 25, 4266);
INSERT INTO public.lab_package_branches VALUES (587, 16, 38, 115, 2899, '24 HR', true, '25% OFF', 'Standard package offered by branch 38', true, '2026-05-28 16:06:53.816851', 25, 3866);
INSERT INTO public.lab_package_branches VALUES (588, 16, 39, 115, 3099, '48 HR', true, '25% OFF', 'Standard package offered by branch 39', true, '2026-05-28 16:06:53.81901', 25, 4132);
INSERT INTO public.lab_package_branches VALUES (590, 16, 41, 115, 2999, '48 HR', true, '25% OFF', 'Standard package offered by branch 41', true, '2026-05-28 16:06:53.82358', 25, 3999);
INSERT INTO public.lab_package_branches VALUES (591, 17, 42, 115, 3199, '24 HR', true, '25% OFF', 'Standard package offered by branch 42', true, '2026-05-28 16:06:53.825696', 25, 4266);
INSERT INTO public.lab_package_branches VALUES (592, 17, 43, 115, 2899, '48 HR', true, '25% OFF', 'Standard package offered by branch 43', true, '2026-05-28 16:06:53.827651', 25, 3866);
INSERT INTO public.lab_package_branches VALUES (593, 17, 44, 115, 3099, '24 HR', true, '25% OFF', 'Standard package offered by branch 44', true, '2026-05-28 16:06:53.829501', 25, 4132);
INSERT INTO public.lab_package_branches VALUES (594, 17, 45, 115, 2799, '48 HR', true, '25% OFF', 'Standard package offered by branch 45', true, '2026-05-28 16:06:53.831539', 25, 3732);
INSERT INTO public.lab_package_branches VALUES (595, 17, 46, 115, 2999, '24 HR', true, '25% OFF', 'Standard package offered by branch 46', true, '2026-05-28 16:06:53.83402', 25, 3999);
INSERT INTO public.lab_package_branches VALUES (596, 18, 47, 115, 3199, '48 HR', true, '25% OFF', 'Standard package offered by branch 47', true, '2026-05-28 16:06:53.836102', 25, 4266);
INSERT INTO public.lab_package_branches VALUES (597, 18, 48, 115, 2899, '24 HR', true, '25% OFF', 'Standard package offered by branch 48', true, '2026-05-28 16:06:53.838423', 25, 3866);
INSERT INTO public.lab_package_branches VALUES (598, 18, 49, 115, 3099, '48 HR', true, '25% OFF', 'Standard package offered by branch 49', true, '2026-05-28 16:06:53.84048', 25, 4132);
INSERT INTO public.lab_package_branches VALUES (599, 18, 50, 115, 2799, '24 HR', true, '25% OFF', 'Standard package offered by branch 50', true, '2026-05-28 16:06:53.842404', 25, 3732);
INSERT INTO public.lab_package_branches VALUES (600, 19, 51, 115, 2999, '48 HR', true, '25% OFF', 'Standard package offered by branch 51', true, '2026-05-28 16:06:53.844264', 25, 3999);
INSERT INTO public.lab_package_branches VALUES (601, 20, 52, 115, 3199, '24 HR', true, '25% OFF', 'Standard package offered by branch 52', true, '2026-05-28 16:06:53.847008', 25, 4266);
INSERT INTO public.lab_package_branches VALUES (602, 20, 53, 115, 2899, '48 HR', true, '25% OFF', 'Standard package offered by branch 53', true, '2026-05-28 16:06:53.848995', 25, 3866);
INSERT INTO public.lab_package_branches VALUES (603, 20, 54, 115, 3099, '24 HR', true, '25% OFF', 'Standard package offered by branch 54', true, '2026-05-28 16:06:53.850983', 25, 4132);
INSERT INTO public.lab_package_branches VALUES (604, 20, 55, 115, 2799, '48 HR', true, '25% OFF', 'Standard package offered by branch 55', true, '2026-05-28 16:06:53.853155', 25, 3732);
INSERT INTO public.lab_package_branches VALUES (605, 21, 56, 115, 2999, '24 HR', true, '25% OFF', 'Standard package offered by branch 56', true, '2026-05-28 16:06:53.855488', 25, 3999);
INSERT INTO public.lab_package_branches VALUES (606, 21, 57, 115, 3199, '48 HR', true, '25% OFF', 'Standard package offered by branch 57', true, '2026-05-28 16:06:53.857431', 25, 4266);
INSERT INTO public.lab_package_branches VALUES (607, 22, 58, 115, 2899, '24 HR', true, '25% OFF', 'Standard package offered by branch 58', true, '2026-05-28 16:06:53.859341', 25, 3866);
INSERT INTO public.lab_package_branches VALUES (608, 22, 59, 115, 3099, '48 HR', true, '25% OFF', 'Standard package offered by branch 59', true, '2026-05-28 16:06:53.863077', 25, 4132);
INSERT INTO public.lab_package_branches VALUES (609, 22, 60, 115, 2799, '24 HR', true, '25% OFF', 'Standard package offered by branch 60', true, '2026-05-28 16:06:53.864939', 25, 3732);
INSERT INTO public.lab_package_branches VALUES (610, 23, 61, 115, 2999, '48 HR', true, '25% OFF', 'Standard package offered by branch 61', true, '2026-05-28 16:06:53.866498', 25, 3999);
INSERT INTO public.lab_package_branches VALUES (611, 24, 62, 115, 3199, '24 HR', true, '25% OFF', 'Standard package offered by branch 62', true, '2026-05-28 16:06:53.867988', 25, 4266);
INSERT INTO public.lab_package_branches VALUES (612, 24, 63, 115, 2899, '48 HR', true, '25% OFF', 'Standard package offered by branch 63', true, '2026-05-28 16:06:53.869657', 25, 3866);
INSERT INTO public.lab_package_branches VALUES (613, 24, 64, 115, 3099, '24 HR', true, '25% OFF', 'Standard package offered by branch 64', true, '2026-05-28 16:06:53.871118', 25, 4132);
INSERT INTO public.lab_package_branches VALUES (614, 25, 65, 115, 2799, '48 HR', true, '25% OFF', 'Standard package offered by branch 65', true, '2026-05-28 16:06:53.872732', 25, 3732);
INSERT INTO public.lab_package_branches VALUES (615, 25, 66, 115, 2999, '24 HR', true, '25% OFF', 'Standard package offered by branch 66', true, '2026-05-28 16:06:53.874449', 25, 3999);
INSERT INTO public.lab_package_branches VALUES (616, 25, 67, 115, 3199, '48 HR', true, '25% OFF', 'Standard package offered by branch 67', true, '2026-05-28 16:06:53.876099', 25, 4266);
INSERT INTO public.lab_package_branches VALUES (617, 26, 68, 115, 2899, '24 HR', true, '25% OFF', 'Standard package offered by branch 68', true, '2026-05-28 16:06:53.877994', 25, 3866);
INSERT INTO public.lab_package_branches VALUES (618, 26, 69, 115, 3099, '48 HR', true, '25% OFF', 'Standard package offered by branch 69', true, '2026-05-28 16:06:53.880052', 25, 4132);
INSERT INTO public.lab_package_branches VALUES (619, 26, 70, 115, 2799, '24 HR', true, '25% OFF', 'Standard package offered by branch 70', true, '2026-05-28 16:06:53.882107', 25, 3732);
INSERT INTO public.lab_package_branches VALUES (621, 27, 72, 115, 3199, '24 HR', true, '25% OFF', 'Standard package offered by branch 72', true, '2026-05-28 16:06:53.886442', 25, 4266);
INSERT INTO public.lab_package_branches VALUES (622, 27, 73, 115, 2899, '48 HR', true, '25% OFF', 'Standard package offered by branch 73', true, '2026-05-28 16:06:53.888165', 25, 3866);
INSERT INTO public.lab_package_branches VALUES (623, 28, 74, 115, 3099, '24 HR', true, '25% OFF', 'Standard package offered by branch 74', true, '2026-05-28 16:06:53.889929', 25, 4132);
INSERT INTO public.lab_package_branches VALUES (624, 29, 75, 115, 2799, '48 HR', true, '25% OFF', 'Standard package offered by branch 75', true, '2026-05-28 16:06:53.891742', 25, 3732);
INSERT INTO public.lab_package_branches VALUES (625, 29, 76, 115, 2999, '24 HR', true, '25% OFF', 'Standard package offered by branch 76', true, '2026-05-28 16:06:53.893194', 25, 3999);
INSERT INTO public.lab_package_branches VALUES (562, 4, 13, 115, 2899, '48 HR', true, '25% OFF', 'Standard package offered by branch 13', true, '2026-05-28 16:06:53.768956', 25, 3866);
INSERT INTO public.lab_package_branches VALUES (563, 4, 14, 115, 3099, '24 HR', true, '25% OFF', 'Standard package offered by branch 14', true, '2026-05-28 16:06:53.771242', 25, 4132);
INSERT INTO public.lab_package_branches VALUES (564, 5, 15, 115, 2799, '48 HR', true, '25% OFF', 'Standard package offered by branch 15', true, '2026-05-28 16:06:53.773662', 25, 3732);
INSERT INTO public.lab_package_branches VALUES (565, 6, 16, 115, 2999, '24 HR', true, '25% OFF', 'Standard package offered by branch 16', true, '2026-05-28 16:06:53.775986', 25, 3999);
INSERT INTO public.lab_package_branches VALUES (631, 30, 82, 115, 3199, '24 HR', true, '25% OFF', 'Standard package offered by branch 82', true, '2026-05-28 16:06:53.904004', 25, 4266);
INSERT INTO public.lab_package_branches VALUES (632, 31, 83, 115, 2899, '48 HR', true, '25% OFF', 'Standard package offered by branch 83', true, '2026-05-28 16:06:53.905696', 25, 3866);
INSERT INTO public.lab_package_branches VALUES (633, 1, 1, 116, 2999, '48 HR', true, '25% OFF', 'Standard package offered by branch 1', true, '2026-05-28 16:06:53.907562', 25, 3999);
INSERT INTO public.lab_package_branches VALUES (634, 1, 2, 116, 3199, '24 HR', true, '25% OFF', 'Standard package offered by branch 2', true, '2026-05-28 16:06:53.909159', 25, 4266);
INSERT INTO public.lab_package_branches VALUES (635, 1, 3, 116, 2899, '48 HR', true, '25% OFF', 'Standard package offered by branch 3', true, '2026-05-28 16:06:53.910513', 25, 3866);
INSERT INTO public.lab_package_branches VALUES (636, 1, 4, 116, 3099, '24 HR', true, '25% OFF', 'Standard package offered by branch 4', true, '2026-05-28 16:06:53.912635', 25, 4132);
INSERT INTO public.lab_package_branches VALUES (637, 2, 5, 116, 2799, '48 HR', true, '25% OFF', 'Standard package offered by branch 5', true, '2026-05-28 16:06:53.914859', 25, 3732);
INSERT INTO public.lab_package_branches VALUES (638, 3, 6, 116, 2999, '24 HR', true, '25% OFF', 'Standard package offered by branch 6', true, '2026-05-28 16:06:53.91694', 25, 3999);
INSERT INTO public.lab_package_branches VALUES (639, 3, 7, 116, 3199, '48 HR', true, '25% OFF', 'Standard package offered by branch 7', true, '2026-05-28 16:06:53.91967', 25, 4266);
INSERT INTO public.lab_package_branches VALUES (640, 3, 8, 116, 2899, '24 HR', true, '25% OFF', 'Standard package offered by branch 8', true, '2026-05-28 16:06:53.921754', 25, 3866);
INSERT INTO public.lab_package_branches VALUES (641, 3, 9, 116, 3099, '48 HR', true, '25% OFF', 'Standard package offered by branch 9', true, '2026-05-28 16:06:53.923729', 25, 4132);
INSERT INTO public.lab_package_branches VALUES (642, 4, 10, 116, 2799, '24 HR', true, '25% OFF', 'Standard package offered by branch 10', true, '2026-05-28 16:06:53.925935', 25, 3732);
INSERT INTO public.lab_package_branches VALUES (643, 4, 11, 116, 2999, '48 HR', true, '25% OFF', 'Standard package offered by branch 11', true, '2026-05-28 16:06:53.927812', 25, 3999);
INSERT INTO public.lab_package_branches VALUES (644, 4, 12, 116, 3199, '24 HR', true, '25% OFF', 'Standard package offered by branch 12', true, '2026-05-28 16:06:53.930023', 25, 4266);
INSERT INTO public.lab_package_branches VALUES (645, 4, 13, 116, 2899, '48 HR', true, '25% OFF', 'Standard package offered by branch 13', true, '2026-05-28 16:06:53.933002', 25, 3866);
INSERT INTO public.lab_package_branches VALUES (646, 4, 14, 116, 3099, '24 HR', true, '25% OFF', 'Standard package offered by branch 14', true, '2026-05-28 16:06:53.935239', 25, 4132);
INSERT INTO public.lab_package_branches VALUES (647, 5, 15, 116, 2799, '48 HR', true, '25% OFF', 'Standard package offered by branch 15', true, '2026-05-28 16:06:53.937222', 25, 3732);
INSERT INTO public.lab_package_branches VALUES (648, 6, 16, 116, 2999, '24 HR', true, '25% OFF', 'Standard package offered by branch 16', true, '2026-05-28 16:06:53.938902', 25, 3999);
INSERT INTO public.lab_package_branches VALUES (649, 6, 17, 116, 3199, '48 HR', true, '25% OFF', 'Standard package offered by branch 17', true, '2026-05-28 16:06:53.940573', 25, 4266);
INSERT INTO public.lab_package_branches VALUES (650, 6, 18, 116, 2899, '24 HR', true, '25% OFF', 'Standard package offered by branch 18', true, '2026-05-28 16:06:53.942458', 25, 3866);
INSERT INTO public.lab_package_branches VALUES (651, 6, 19, 116, 3099, '48 HR', true, '25% OFF', 'Standard package offered by branch 19', true, '2026-05-28 16:06:53.945027', 25, 4132);
INSERT INTO public.lab_package_branches VALUES (652, 7, 20, 116, 2799, '24 HR', true, '25% OFF', 'Standard package offered by branch 20', true, '2026-05-28 16:06:53.947744', 25, 3732);
INSERT INTO public.lab_package_branches VALUES (653, 8, 21, 116, 2999, '48 HR', true, '25% OFF', 'Standard package offered by branch 21', true, '2026-05-28 16:06:53.949763', 25, 3999);
INSERT INTO public.lab_package_branches VALUES (655, 8, 23, 116, 2899, '48 HR', true, '25% OFF', 'Standard package offered by branch 23', true, '2026-05-28 16:06:53.953597', 25, 3866);
INSERT INTO public.lab_package_branches VALUES (656, 9, 24, 116, 3099, '24 HR', true, '25% OFF', 'Standard package offered by branch 24', true, '2026-05-28 16:06:53.955261', 25, 4132);
INSERT INTO public.lab_package_branches VALUES (657, 10, 25, 116, 2799, '48 HR', true, '25% OFF', 'Standard package offered by branch 25', true, '2026-05-28 16:06:53.957196', 25, 3732);
INSERT INTO public.lab_package_branches VALUES (658, 10, 26, 116, 2999, '24 HR', true, '25% OFF', 'Standard package offered by branch 26', true, '2026-05-28 16:06:53.959046', 25, 3999);
INSERT INTO public.lab_package_branches VALUES (659, 10, 27, 116, 3199, '48 HR', true, '25% OFF', 'Standard package offered by branch 27', true, '2026-05-28 16:06:53.96101', 25, 4266);
INSERT INTO public.lab_package_branches VALUES (660, 11, 28, 116, 2899, '24 HR', true, '25% OFF', 'Standard package offered by branch 28', true, '2026-05-28 16:06:53.962862', 25, 3866);
INSERT INTO public.lab_package_branches VALUES (661, 12, 29, 116, 3099, '48 HR', true, '25% OFF', 'Standard package offered by branch 29', true, '2026-05-28 16:06:53.965165', 25, 4132);
INSERT INTO public.lab_package_branches VALUES (662, 12, 30, 116, 2799, '24 HR', true, '25% OFF', 'Standard package offered by branch 30', true, '2026-05-28 16:06:53.967345', 25, 3732);
INSERT INTO public.lab_package_branches VALUES (663, 12, 31, 116, 2999, '48 HR', true, '25% OFF', 'Standard package offered by branch 31', true, '2026-05-28 16:06:53.968661', 25, 3999);
INSERT INTO public.lab_package_branches VALUES (664, 13, 32, 116, 3199, '24 HR', true, '25% OFF', 'Standard package offered by branch 32', true, '2026-05-28 16:06:53.970008', 25, 4266);
INSERT INTO public.lab_package_branches VALUES (665, 14, 33, 116, 2899, '48 HR', true, '25% OFF', 'Standard package offered by branch 33', true, '2026-05-28 16:06:53.971429', 25, 3866);
INSERT INTO public.lab_package_branches VALUES (666, 14, 34, 116, 3099, '24 HR', true, '25% OFF', 'Standard package offered by branch 34', true, '2026-05-28 16:06:53.972915', 25, 4132);
INSERT INTO public.lab_package_branches VALUES (667, 14, 35, 116, 2799, '48 HR', true, '25% OFF', 'Standard package offered by branch 35', true, '2026-05-28 16:06:53.975194', 25, 3732);
INSERT INTO public.lab_package_branches VALUES (668, 14, 36, 116, 2999, '24 HR', true, '25% OFF', 'Standard package offered by branch 36', true, '2026-05-28 16:06:53.97696', 25, 3999);
INSERT INTO public.lab_package_branches VALUES (669, 15, 37, 116, 3199, '48 HR', true, '25% OFF', 'Standard package offered by branch 37', true, '2026-05-28 16:06:53.978452', 25, 4266);
INSERT INTO public.lab_package_branches VALUES (670, 16, 38, 116, 2899, '24 HR', true, '25% OFF', 'Standard package offered by branch 38', true, '2026-05-28 16:06:53.980034', 25, 3866);
INSERT INTO public.lab_package_branches VALUES (671, 16, 39, 116, 3099, '48 HR', true, '25% OFF', 'Standard package offered by branch 39', true, '2026-05-28 16:06:53.981444', 25, 4132);
INSERT INTO public.lab_package_branches VALUES (672, 16, 40, 116, 2799, '24 HR', true, '25% OFF', 'Standard package offered by branch 40', true, '2026-05-28 16:06:53.982869', 25, 3732);
INSERT INTO public.lab_package_branches VALUES (673, 16, 41, 116, 2999, '48 HR', true, '25% OFF', 'Standard package offered by branch 41', true, '2026-05-28 16:06:53.984289', 25, 3999);
INSERT INTO public.lab_package_branches VALUES (674, 17, 42, 116, 3199, '24 HR', true, '25% OFF', 'Standard package offered by branch 42', true, '2026-05-28 16:06:53.985629', 25, 4266);
INSERT INTO public.lab_package_branches VALUES (675, 17, 43, 116, 2899, '48 HR', true, '25% OFF', 'Standard package offered by branch 43', true, '2026-05-28 16:06:53.987129', 25, 3866);
INSERT INTO public.lab_package_branches VALUES (676, 17, 44, 116, 3099, '24 HR', true, '25% OFF', 'Standard package offered by branch 44', true, '2026-05-28 16:06:53.988576', 25, 4132);
INSERT INTO public.lab_package_branches VALUES (677, 17, 45, 116, 2799, '48 HR', true, '25% OFF', 'Standard package offered by branch 45', true, '2026-05-28 16:06:53.99004', 25, 3732);
INSERT INTO public.lab_package_branches VALUES (678, 17, 46, 116, 2999, '24 HR', true, '25% OFF', 'Standard package offered by branch 46', true, '2026-05-28 16:06:53.992009', 25, 3999);
INSERT INTO public.lab_package_branches VALUES (679, 18, 47, 116, 3199, '48 HR', true, '25% OFF', 'Standard package offered by branch 47', true, '2026-05-28 16:06:53.993783', 25, 4266);
INSERT INTO public.lab_package_branches VALUES (680, 18, 48, 116, 2899, '24 HR', true, '25% OFF', 'Standard package offered by branch 48', true, '2026-05-28 16:06:53.995467', 25, 3866);
INSERT INTO public.lab_package_branches VALUES (681, 18, 49, 116, 3099, '48 HR', true, '25% OFF', 'Standard package offered by branch 49', true, '2026-05-28 16:06:53.99706', 25, 4132);
INSERT INTO public.lab_package_branches VALUES (682, 18, 50, 116, 2799, '24 HR', true, '25% OFF', 'Standard package offered by branch 50', true, '2026-05-28 16:06:53.998434', 25, 3732);
INSERT INTO public.lab_package_branches VALUES (683, 19, 51, 116, 2999, '48 HR', true, '25% OFF', 'Standard package offered by branch 51', true, '2026-05-28 16:06:53.999902', 25, 3999);
INSERT INTO public.lab_package_branches VALUES (684, 20, 52, 116, 3199, '24 HR', true, '25% OFF', 'Standard package offered by branch 52', true, '2026-05-28 16:06:54.001456', 25, 4266);
INSERT INTO public.lab_package_branches VALUES (686, 20, 54, 116, 3099, '24 HR', true, '25% OFF', 'Standard package offered by branch 54', true, '2026-05-28 16:06:54.010105', 25, 4132);
INSERT INTO public.lab_package_branches VALUES (687, 20, 55, 116, 2799, '48 HR', true, '25% OFF', 'Standard package offered by branch 55', true, '2026-05-28 16:06:54.011765', 25, 3732);
INSERT INTO public.lab_package_branches VALUES (688, 21, 56, 116, 2999, '24 HR', true, '25% OFF', 'Standard package offered by branch 56', true, '2026-05-28 16:06:54.014182', 25, 3999);
INSERT INTO public.lab_package_branches VALUES (689, 21, 57, 116, 3199, '48 HR', true, '25% OFF', 'Standard package offered by branch 57', true, '2026-05-28 16:06:54.016965', 25, 4266);
INSERT INTO public.lab_package_branches VALUES (690, 22, 58, 116, 2899, '24 HR', true, '25% OFF', 'Standard package offered by branch 58', true, '2026-05-28 16:06:54.019261', 25, 3866);
INSERT INTO public.lab_package_branches VALUES (627, 29, 78, 115, 2899, '24 HR', true, '25% OFF', 'Standard package offered by branch 78', true, '2026-05-28 16:06:53.897287', 25, 3866);
INSERT INTO public.lab_package_branches VALUES (628, 30, 79, 115, 3099, '48 HR', true, '25% OFF', 'Standard package offered by branch 79', true, '2026-05-28 16:06:53.898958', 25, 4132);
INSERT INTO public.lab_package_branches VALUES (629, 30, 80, 115, 2799, '24 HR', true, '25% OFF', 'Standard package offered by branch 80', true, '2026-05-28 16:06:53.900797', 25, 3732);
INSERT INTO public.lab_package_branches VALUES (630, 30, 81, 115, 2999, '48 HR', true, '25% OFF', 'Standard package offered by branch 81', true, '2026-05-28 16:06:53.902357', 25, 3999);
INSERT INTO public.lab_package_branches VALUES (696, 24, 64, 116, 3099, '24 HR', true, '25% OFF', 'Standard package offered by branch 64', true, '2026-05-28 16:06:54.032694', 25, 4132);
INSERT INTO public.lab_package_branches VALUES (697, 25, 65, 116, 2799, '48 HR', true, '25% OFF', 'Standard package offered by branch 65', true, '2026-05-28 16:06:54.034775', 25, 3732);
INSERT INTO public.lab_package_branches VALUES (698, 25, 66, 116, 2999, '24 HR', true, '25% OFF', 'Standard package offered by branch 66', true, '2026-05-28 16:06:54.036501', 25, 3999);
INSERT INTO public.lab_package_branches VALUES (699, 25, 67, 116, 3199, '48 HR', true, '25% OFF', 'Standard package offered by branch 67', true, '2026-05-28 16:06:54.038278', 25, 4266);
INSERT INTO public.lab_package_branches VALUES (700, 26, 68, 116, 2899, '24 HR', true, '25% OFF', 'Standard package offered by branch 68', true, '2026-05-28 16:06:54.039881', 25, 3866);
INSERT INTO public.lab_package_branches VALUES (701, 26, 69, 116, 3099, '48 HR', true, '25% OFF', 'Standard package offered by branch 69', true, '2026-05-28 16:06:54.041806', 25, 4132);
INSERT INTO public.lab_package_branches VALUES (702, 26, 70, 116, 2799, '24 HR', true, '25% OFF', 'Standard package offered by branch 70', true, '2026-05-28 16:06:54.043779', 25, 3732);
INSERT INTO public.lab_package_branches VALUES (703, 27, 71, 116, 2999, '48 HR', true, '25% OFF', 'Standard package offered by branch 71', true, '2026-05-28 16:06:54.045689', 25, 3999);
INSERT INTO public.lab_package_branches VALUES (704, 27, 72, 116, 3199, '24 HR', true, '25% OFF', 'Standard package offered by branch 72', true, '2026-05-28 16:06:54.047292', 25, 4266);
INSERT INTO public.lab_package_branches VALUES (705, 27, 73, 116, 2899, '48 HR', true, '25% OFF', 'Standard package offered by branch 73', true, '2026-05-28 16:06:54.049003', 25, 3866);
INSERT INTO public.lab_package_branches VALUES (706, 28, 74, 116, 3099, '24 HR', true, '25% OFF', 'Standard package offered by branch 74', true, '2026-05-28 16:06:54.050644', 25, 4132);
INSERT INTO public.lab_package_branches VALUES (707, 29, 75, 116, 2799, '48 HR', true, '25% OFF', 'Standard package offered by branch 75', true, '2026-05-28 16:06:54.051922', 25, 3732);
INSERT INTO public.lab_package_branches VALUES (708, 29, 76, 116, 2999, '24 HR', true, '25% OFF', 'Standard package offered by branch 76', true, '2026-05-28 16:06:54.053149', 25, 3999);
INSERT INTO public.lab_package_branches VALUES (709, 29, 77, 116, 3199, '48 HR', true, '25% OFF', 'Standard package offered by branch 77', true, '2026-05-28 16:06:54.054624', 25, 4266);
INSERT INTO public.lab_package_branches VALUES (710, 29, 78, 116, 2899, '24 HR', true, '25% OFF', 'Standard package offered by branch 78', true, '2026-05-28 16:06:54.055929', 25, 3866);
INSERT INTO public.lab_package_branches VALUES (711, 30, 79, 116, 3099, '48 HR', true, '25% OFF', 'Standard package offered by branch 79', true, '2026-05-28 16:06:54.057455', 25, 4132);
INSERT INTO public.lab_package_branches VALUES (712, 30, 80, 116, 2799, '24 HR', true, '25% OFF', 'Standard package offered by branch 80', true, '2026-05-28 16:06:54.061158', 25, 3732);
INSERT INTO public.lab_package_branches VALUES (713, 30, 81, 116, 2999, '48 HR', true, '25% OFF', 'Standard package offered by branch 81', true, '2026-05-28 16:06:54.064898', 25, 3999);
INSERT INTO public.lab_package_branches VALUES (714, 30, 82, 116, 3199, '24 HR', true, '25% OFF', 'Standard package offered by branch 82', true, '2026-05-28 16:06:54.068212', 25, 4266);
INSERT INTO public.lab_package_branches VALUES (715, 31, 83, 116, 2899, '48 HR', true, '25% OFF', 'Standard package offered by branch 83', true, '2026-05-28 16:06:54.070949', 25, 3866);
INSERT INTO public.lab_package_branches VALUES (716, 1, 1, 117, 2999, '48 HR', true, '25% OFF', 'Standard package offered by branch 1', true, '2026-05-28 16:06:54.07288', 25, 3999);
INSERT INTO public.lab_package_branches VALUES (717, 1, 2, 117, 3199, '24 HR', true, '25% OFF', 'Standard package offered by branch 2', true, '2026-05-28 16:06:54.075662', 25, 4266);
INSERT INTO public.lab_package_branches VALUES (693, 23, 61, 116, 2999, '48 HR', true, '25% OFF', 'Standard package offered by branch 61', true, '2026-05-28 16:06:54.027013', 25, 3999);
INSERT INTO public.lab_package_branches VALUES (720, 2, 5, 117, 2799, '48 HR', true, '25% OFF', 'Standard package offered by branch 5', true, '2026-05-28 16:06:54.082057', 25, 3732);
INSERT INTO public.lab_package_branches VALUES (721, 3, 6, 117, 2999, '24 HR', true, '25% OFF', 'Standard package offered by branch 6', true, '2026-05-28 16:06:54.083959', 25, 3999);
INSERT INTO public.lab_package_branches VALUES (722, 3, 7, 117, 3199, '48 HR', true, '25% OFF', 'Standard package offered by branch 7', true, '2026-05-28 16:06:54.08607', 25, 4266);
INSERT INTO public.lab_package_branches VALUES (723, 3, 8, 117, 2899, '24 HR', true, '25% OFF', 'Standard package offered by branch 8', true, '2026-05-28 16:06:54.088291', 25, 3866);
INSERT INTO public.lab_package_branches VALUES (724, 3, 9, 117, 3099, '48 HR', true, '25% OFF', 'Standard package offered by branch 9', true, '2026-05-28 16:06:54.090073', 25, 4132);
INSERT INTO public.lab_package_branches VALUES (725, 4, 10, 117, 2799, '24 HR', true, '25% OFF', 'Standard package offered by branch 10', true, '2026-05-28 16:06:54.093174', 25, 3732);
INSERT INTO public.lab_package_branches VALUES (726, 4, 11, 117, 2999, '48 HR', true, '25% OFF', 'Standard package offered by branch 11', true, '2026-05-28 16:06:54.095343', 25, 3999);
INSERT INTO public.lab_package_branches VALUES (727, 4, 12, 117, 3199, '24 HR', true, '25% OFF', 'Standard package offered by branch 12', true, '2026-05-28 16:06:54.097659', 25, 4266);
INSERT INTO public.lab_package_branches VALUES (728, 4, 13, 117, 2899, '48 HR', true, '25% OFF', 'Standard package offered by branch 13', true, '2026-05-28 16:06:54.100126', 25, 3866);
INSERT INTO public.lab_package_branches VALUES (729, 4, 14, 117, 3099, '24 HR', true, '25% OFF', 'Standard package offered by branch 14', true, '2026-05-28 16:06:54.101627', 25, 4132);
INSERT INTO public.lab_package_branches VALUES (730, 5, 15, 117, 2799, '48 HR', true, '25% OFF', 'Standard package offered by branch 15', true, '2026-05-28 16:06:54.103479', 25, 3732);
INSERT INTO public.lab_package_branches VALUES (731, 6, 16, 117, 2999, '24 HR', true, '25% OFF', 'Standard package offered by branch 16', true, '2026-05-28 16:06:54.105237', 25, 3999);
INSERT INTO public.lab_package_branches VALUES (732, 6, 17, 117, 3199, '48 HR', true, '25% OFF', 'Standard package offered by branch 17', true, '2026-05-28 16:06:54.107066', 25, 4266);
INSERT INTO public.lab_package_branches VALUES (733, 6, 18, 117, 2899, '24 HR', true, '25% OFF', 'Standard package offered by branch 18', true, '2026-05-28 16:06:54.108696', 25, 3866);
INSERT INTO public.lab_package_branches VALUES (734, 6, 19, 117, 3099, '48 HR', true, '25% OFF', 'Standard package offered by branch 19', true, '2026-05-28 16:06:54.110227', 25, 4132);
INSERT INTO public.lab_package_branches VALUES (735, 7, 20, 117, 2799, '24 HR', true, '25% OFF', 'Standard package offered by branch 20', true, '2026-05-28 16:06:54.112274', 25, 3732);
INSERT INTO public.lab_package_branches VALUES (736, 8, 21, 117, 2999, '48 HR', true, '25% OFF', 'Standard package offered by branch 21', true, '2026-05-28 16:06:54.11423', 25, 3999);
INSERT INTO public.lab_package_branches VALUES (737, 8, 22, 117, 3199, '24 HR', true, '25% OFF', 'Standard package offered by branch 22', true, '2026-05-28 16:06:54.115943', 25, 4266);
INSERT INTO public.lab_package_branches VALUES (738, 8, 23, 117, 2899, '48 HR', true, '25% OFF', 'Standard package offered by branch 23', true, '2026-05-28 16:06:54.117231', 25, 3866);
INSERT INTO public.lab_package_branches VALUES (739, 9, 24, 117, 3099, '24 HR', true, '25% OFF', 'Standard package offered by branch 24', true, '2026-05-28 16:06:54.118826', 25, 4132);
INSERT INTO public.lab_package_branches VALUES (740, 10, 25, 117, 2799, '48 HR', true, '25% OFF', 'Standard package offered by branch 25', true, '2026-05-28 16:06:54.120058', 25, 3732);
INSERT INTO public.lab_package_branches VALUES (741, 10, 26, 117, 2999, '24 HR', true, '25% OFF', 'Standard package offered by branch 26', true, '2026-05-28 16:06:54.121128', 25, 3999);
INSERT INTO public.lab_package_branches VALUES (742, 10, 27, 117, 3199, '48 HR', true, '25% OFF', 'Standard package offered by branch 27', true, '2026-05-28 16:06:54.122489', 25, 4266);
INSERT INTO public.lab_package_branches VALUES (743, 11, 28, 117, 2899, '24 HR', true, '25% OFF', 'Standard package offered by branch 28', true, '2026-05-28 16:06:54.124344', 25, 3866);
INSERT INTO public.lab_package_branches VALUES (744, 12, 29, 117, 3099, '48 HR', true, '25% OFF', 'Standard package offered by branch 29', true, '2026-05-28 16:06:54.126025', 25, 4132);
INSERT INTO public.lab_package_branches VALUES (745, 12, 30, 117, 2799, '24 HR', true, '25% OFF', 'Standard package offered by branch 30', true, '2026-05-28 16:06:54.127557', 25, 3732);
INSERT INTO public.lab_package_branches VALUES (746, 12, 31, 117, 2999, '48 HR', true, '25% OFF', 'Standard package offered by branch 31', true, '2026-05-28 16:06:54.129406', 25, 3999);
INSERT INTO public.lab_package_branches VALUES (747, 13, 32, 117, 3199, '24 HR', true, '25% OFF', 'Standard package offered by branch 32', true, '2026-05-28 16:06:54.130988', 25, 4266);
INSERT INTO public.lab_package_branches VALUES (748, 14, 33, 117, 2899, '48 HR', true, '25% OFF', 'Standard package offered by branch 33', true, '2026-05-28 16:06:54.13236', 25, 3866);
INSERT INTO public.lab_package_branches VALUES (749, 14, 34, 117, 3099, '24 HR', true, '25% OFF', 'Standard package offered by branch 34', true, '2026-05-28 16:06:54.134336', 25, 4132);
INSERT INTO public.lab_package_branches VALUES (751, 14, 36, 117, 2999, '24 HR', true, '25% OFF', 'Standard package offered by branch 36', true, '2026-05-28 16:06:54.137657', 25, 3999);
INSERT INTO public.lab_package_branches VALUES (752, 15, 37, 117, 3199, '48 HR', true, '25% OFF', 'Standard package offered by branch 37', true, '2026-05-28 16:06:54.139182', 25, 4266);
INSERT INTO public.lab_package_branches VALUES (753, 16, 38, 117, 2899, '24 HR', true, '25% OFF', 'Standard package offered by branch 38', true, '2026-05-28 16:06:54.145229', 25, 3866);
INSERT INTO public.lab_package_branches VALUES (754, 16, 39, 117, 3099, '48 HR', true, '25% OFF', 'Standard package offered by branch 39', true, '2026-05-28 16:06:54.148055', 25, 4132);
INSERT INTO public.lab_package_branches VALUES (755, 16, 40, 117, 2799, '24 HR', true, '25% OFF', 'Standard package offered by branch 40', true, '2026-05-28 16:06:54.150463', 25, 3732);
INSERT INTO public.lab_package_branches VALUES (692, 22, 60, 116, 2799, '24 HR', true, '25% OFF', 'Standard package offered by branch 60', true, '2026-05-28 16:06:54.024429', 25, 3732);
INSERT INTO public.lab_package_branches VALUES (694, 24, 62, 116, 3199, '24 HR', true, '25% OFF', 'Standard package offered by branch 62', true, '2026-05-28 16:06:54.029006', 25, 4266);
INSERT INTO public.lab_package_branches VALUES (718, 1, 3, 117, 2899, '48 HR', true, '25% OFF', 'Standard package offered by branch 3', true, '2026-05-28 16:06:54.077754', 25, 3866);
INSERT INTO public.lab_package_branches VALUES (695, 24, 63, 116, 2899, '48 HR', true, '25% OFF', 'Standard package offered by branch 63', true, '2026-05-28 16:06:54.031', 25, 3866);
INSERT INTO public.lab_package_branches VALUES (761, 17, 46, 117, 2999, '24 HR', true, '25% OFF', 'Standard package offered by branch 46', true, '2026-05-28 16:06:54.162777', 25, 3999);
INSERT INTO public.lab_package_branches VALUES (762, 18, 47, 117, 3199, '48 HR', true, '25% OFF', 'Standard package offered by branch 47', true, '2026-05-28 16:06:54.164973', 25, 4266);
INSERT INTO public.lab_package_branches VALUES (763, 18, 48, 117, 2899, '24 HR', true, '25% OFF', 'Standard package offered by branch 48', true, '2026-05-28 16:06:54.168351', 25, 3866);
INSERT INTO public.lab_package_branches VALUES (764, 18, 49, 117, 3099, '48 HR', true, '25% OFF', 'Standard package offered by branch 49', true, '2026-05-28 16:06:54.170464', 25, 4132);
INSERT INTO public.lab_package_branches VALUES (765, 18, 50, 117, 2799, '24 HR', true, '25% OFF', 'Standard package offered by branch 50', true, '2026-05-28 16:06:54.172224', 25, 3732);
INSERT INTO public.lab_package_branches VALUES (766, 19, 51, 117, 2999, '48 HR', true, '25% OFF', 'Standard package offered by branch 51', true, '2026-05-28 16:06:54.173693', 25, 3999);
INSERT INTO public.lab_package_branches VALUES (767, 20, 52, 117, 3199, '24 HR', true, '25% OFF', 'Standard package offered by branch 52', true, '2026-05-28 16:06:54.175141', 25, 4266);
INSERT INTO public.lab_package_branches VALUES (768, 20, 53, 117, 2899, '48 HR', true, '25% OFF', 'Standard package offered by branch 53', true, '2026-05-28 16:06:54.176771', 25, 3866);
INSERT INTO public.lab_package_branches VALUES (769, 20, 54, 117, 3099, '24 HR', true, '25% OFF', 'Standard package offered by branch 54', true, '2026-05-28 16:06:54.17897', 25, 4132);
INSERT INTO public.lab_package_branches VALUES (770, 20, 55, 117, 2799, '48 HR', true, '25% OFF', 'Standard package offered by branch 55', true, '2026-05-28 16:06:54.180753', 25, 3732);
INSERT INTO public.lab_package_branches VALUES (771, 21, 56, 117, 2999, '24 HR', true, '25% OFF', 'Standard package offered by branch 56', true, '2026-05-28 16:06:54.182669', 25, 3999);
INSERT INTO public.lab_package_branches VALUES (772, 21, 57, 117, 3199, '48 HR', true, '25% OFF', 'Standard package offered by branch 57', true, '2026-05-28 16:06:54.184332', 25, 4266);
INSERT INTO public.lab_package_branches VALUES (773, 22, 58, 117, 2899, '24 HR', true, '25% OFF', 'Standard package offered by branch 58', true, '2026-05-28 16:06:54.18623', 25, 3866);
INSERT INTO public.lab_package_branches VALUES (774, 22, 59, 117, 3099, '48 HR', true, '25% OFF', 'Standard package offered by branch 59', true, '2026-05-28 16:06:54.187962', 25, 4132);
INSERT INTO public.lab_package_branches VALUES (775, 22, 60, 117, 2799, '24 HR', true, '25% OFF', 'Standard package offered by branch 60', true, '2026-05-28 16:06:54.189403', 25, 3732);
INSERT INTO public.lab_package_branches VALUES (776, 23, 61, 117, 2999, '48 HR', true, '25% OFF', 'Standard package offered by branch 61', true, '2026-05-28 16:06:54.191159', 25, 3999);
INSERT INTO public.lab_package_branches VALUES (777, 24, 62, 117, 3199, '24 HR', true, '25% OFF', 'Standard package offered by branch 62', true, '2026-05-28 16:06:54.192884', 25, 4266);
INSERT INTO public.lab_package_branches VALUES (778, 24, 63, 117, 2899, '48 HR', true, '25% OFF', 'Standard package offered by branch 63', true, '2026-05-28 16:06:54.194792', 25, 3866);
INSERT INTO public.lab_package_branches VALUES (779, 24, 64, 117, 3099, '24 HR', true, '25% OFF', 'Standard package offered by branch 64', true, '2026-05-28 16:06:54.196554', 25, 4132);
INSERT INTO public.lab_package_branches VALUES (780, 25, 65, 117, 2799, '48 HR', true, '25% OFF', 'Standard package offered by branch 65', true, '2026-05-28 16:06:54.197944', 25, 3732);
INSERT INTO public.lab_package_branches VALUES (781, 25, 66, 117, 2999, '24 HR', true, '25% OFF', 'Standard package offered by branch 66', true, '2026-05-28 16:06:54.199423', 25, 3999);
INSERT INTO public.lab_package_branches VALUES (782, 25, 67, 117, 3199, '48 HR', true, '25% OFF', 'Standard package offered by branch 67', true, '2026-05-28 16:06:54.200979', 25, 4266);
INSERT INTO public.lab_package_branches VALUES (783, 26, 68, 117, 2899, '24 HR', true, '25% OFF', 'Standard package offered by branch 68', true, '2026-05-28 16:06:54.202418', 25, 3866);
INSERT INTO public.lab_package_branches VALUES (785, 26, 70, 117, 2799, '24 HR', true, '25% OFF', 'Standard package offered by branch 70', true, '2026-05-28 16:06:54.205129', 25, 3732);
INSERT INTO public.lab_package_branches VALUES (786, 27, 71, 117, 2999, '48 HR', true, '25% OFF', 'Standard package offered by branch 71', true, '2026-05-28 16:06:54.206169', 25, 3999);
INSERT INTO public.lab_package_branches VALUES (787, 27, 72, 117, 3199, '24 HR', true, '25% OFF', 'Standard package offered by branch 72', true, '2026-05-28 16:06:54.207443', 25, 4266);
INSERT INTO public.lab_package_branches VALUES (788, 27, 73, 117, 2899, '48 HR', true, '25% OFF', 'Standard package offered by branch 73', true, '2026-05-28 16:06:54.20916', 25, 3866);
INSERT INTO public.lab_package_branches VALUES (789, 28, 74, 117, 3099, '24 HR', true, '25% OFF', 'Standard package offered by branch 74', true, '2026-05-28 16:06:54.210584', 25, 4132);
INSERT INTO public.lab_package_branches VALUES (790, 29, 75, 117, 2799, '48 HR', true, '25% OFF', 'Standard package offered by branch 75', true, '2026-05-28 16:06:54.211926', 25, 3732);
INSERT INTO public.lab_package_branches VALUES (791, 29, 76, 117, 2999, '24 HR', true, '25% OFF', 'Standard package offered by branch 76', true, '2026-05-28 16:06:54.213465', 25, 3999);
INSERT INTO public.lab_package_branches VALUES (792, 29, 77, 117, 3199, '48 HR', true, '25% OFF', 'Standard package offered by branch 77', true, '2026-05-28 16:06:54.215112', 25, 4266);
INSERT INTO public.lab_package_branches VALUES (793, 29, 78, 117, 2899, '24 HR', true, '25% OFF', 'Standard package offered by branch 78', true, '2026-05-28 16:06:54.216388', 25, 3866);
INSERT INTO public.lab_package_branches VALUES (794, 30, 79, 117, 3099, '48 HR', true, '25% OFF', 'Standard package offered by branch 79', true, '2026-05-28 16:06:54.217563', 25, 4132);
INSERT INTO public.lab_package_branches VALUES (795, 30, 80, 117, 2799, '24 HR', true, '25% OFF', 'Standard package offered by branch 80', true, '2026-05-28 16:06:54.218888', 25, 3732);
INSERT INTO public.lab_package_branches VALUES (796, 30, 81, 117, 2999, '48 HR', true, '25% OFF', 'Standard package offered by branch 81', true, '2026-05-28 16:06:54.220523', 25, 3999);
INSERT INTO public.lab_package_branches VALUES (797, 30, 82, 117, 3199, '24 HR', true, '25% OFF', 'Standard package offered by branch 82', true, '2026-05-28 16:06:54.222224', 25, 4266);
INSERT INTO public.lab_package_branches VALUES (798, 31, 83, 117, 2899, '48 HR', true, '25% OFF', 'Standard package offered by branch 83', true, '2026-05-28 16:06:54.224415', 25, 3866);
INSERT INTO public.lab_package_branches VALUES (799, 1, 1, 118, 2999, '48 HR', true, '25% OFF', 'Standard package offered by branch 1', true, '2026-05-28 16:06:54.226284', 25, 3999);
INSERT INTO public.lab_package_branches VALUES (800, 1, 2, 118, 3199, '24 HR', true, '25% OFF', 'Standard package offered by branch 2', true, '2026-05-28 16:06:54.227832', 25, 4266);
INSERT INTO public.lab_package_branches VALUES (801, 1, 3, 118, 2899, '48 HR', true, '25% OFF', 'Standard package offered by branch 3', true, '2026-05-28 16:06:54.229361', 25, 3866);
INSERT INTO public.lab_package_branches VALUES (802, 1, 4, 118, 3099, '24 HR', true, '25% OFF', 'Standard package offered by branch 4', true, '2026-05-28 16:06:54.231302', 25, 4132);
INSERT INTO public.lab_package_branches VALUES (803, 2, 5, 118, 2799, '48 HR', true, '25% OFF', 'Standard package offered by branch 5', true, '2026-05-28 16:06:54.232821', 25, 3732);
INSERT INTO public.lab_package_branches VALUES (804, 3, 6, 118, 2999, '24 HR', true, '25% OFF', 'Standard package offered by branch 6', true, '2026-05-28 16:06:54.234247', 25, 3999);
INSERT INTO public.lab_package_branches VALUES (805, 3, 7, 118, 3199, '48 HR', true, '25% OFF', 'Standard package offered by branch 7', true, '2026-05-28 16:06:54.235924', 25, 4266);
INSERT INTO public.lab_package_branches VALUES (806, 3, 8, 118, 2899, '24 HR', true, '25% OFF', 'Standard package offered by branch 8', true, '2026-05-28 16:06:54.237401', 25, 3866);
INSERT INTO public.lab_package_branches VALUES (807, 3, 9, 118, 3099, '48 HR', true, '25% OFF', 'Standard package offered by branch 9', true, '2026-05-28 16:06:54.239082', 25, 4132);
INSERT INTO public.lab_package_branches VALUES (808, 4, 10, 118, 2799, '24 HR', true, '25% OFF', 'Standard package offered by branch 10', true, '2026-05-28 16:06:54.241717', 25, 3732);
INSERT INTO public.lab_package_branches VALUES (809, 4, 11, 118, 2999, '48 HR', true, '25% OFF', 'Standard package offered by branch 11', true, '2026-05-28 16:06:54.243458', 25, 3999);
INSERT INTO public.lab_package_branches VALUES (810, 4, 12, 118, 3199, '24 HR', true, '25% OFF', 'Standard package offered by branch 12', true, '2026-05-28 16:06:54.245191', 25, 4266);
INSERT INTO public.lab_package_branches VALUES (811, 4, 13, 118, 2899, '48 HR', true, '25% OFF', 'Standard package offered by branch 13', true, '2026-05-28 16:06:54.246887', 25, 3866);
INSERT INTO public.lab_package_branches VALUES (812, 4, 14, 118, 3099, '24 HR', true, '25% OFF', 'Standard package offered by branch 14', true, '2026-05-28 16:06:54.248682', 25, 4132);
INSERT INTO public.lab_package_branches VALUES (813, 5, 15, 118, 2799, '48 HR', true, '25% OFF', 'Standard package offered by branch 15', true, '2026-05-28 16:06:54.25026', 25, 3732);
INSERT INTO public.lab_package_branches VALUES (814, 6, 16, 118, 2999, '24 HR', true, '25% OFF', 'Standard package offered by branch 16', true, '2026-05-28 16:06:54.251781', 25, 3999);
INSERT INTO public.lab_package_branches VALUES (816, 6, 18, 118, 2899, '24 HR', true, '25% OFF', 'Standard package offered by branch 18', true, '2026-05-28 16:06:54.254185', 25, 3866);
INSERT INTO public.lab_package_branches VALUES (817, 6, 19, 118, 3099, '48 HR', true, '25% OFF', 'Standard package offered by branch 19', true, '2026-05-28 16:06:54.255563', 25, 4132);
INSERT INTO public.lab_package_branches VALUES (818, 7, 20, 118, 2799, '24 HR', true, '25% OFF', 'Standard package offered by branch 20', true, '2026-05-28 16:06:54.25672', 25, 3732);
INSERT INTO public.lab_package_branches VALUES (819, 8, 21, 118, 2999, '48 HR', true, '25% OFF', 'Standard package offered by branch 21', true, '2026-05-28 16:06:54.258237', 25, 3999);
INSERT INTO public.lab_package_branches VALUES (820, 8, 22, 118, 3199, '24 HR', true, '25% OFF', 'Standard package offered by branch 22', true, '2026-05-28 16:06:54.259685', 25, 4266);
INSERT INTO public.lab_package_branches VALUES (757, 17, 42, 117, 3199, '24 HR', true, '25% OFF', 'Standard package offered by branch 42', true, '2026-05-28 16:06:54.154736', 25, 4266);
INSERT INTO public.lab_package_branches VALUES (758, 17, 43, 117, 2899, '48 HR', true, '25% OFF', 'Standard package offered by branch 43', true, '2026-05-28 16:06:54.156453', 25, 3866);
INSERT INTO public.lab_package_branches VALUES (759, 17, 44, 117, 3099, '24 HR', true, '25% OFF', 'Standard package offered by branch 44', true, '2026-05-28 16:06:54.158757', 25, 4132);
INSERT INTO public.lab_package_branches VALUES (760, 17, 45, 117, 2799, '48 HR', true, '25% OFF', 'Standard package offered by branch 45', true, '2026-05-28 16:06:54.160749', 25, 3732);
INSERT INTO public.lab_package_branches VALUES (822, 9, 24, 118, 3099, '24 HR', true, '25% OFF', 'Standard package offered by branch 24', true, '2026-05-28 16:06:54.263032', 25, 4132);
INSERT INTO public.lab_package_branches VALUES (823, 10, 25, 118, 2799, '48 HR', true, '25% OFF', 'Standard package offered by branch 25', true, '2026-05-28 16:06:54.264722', 25, 3732);
INSERT INTO public.lab_package_branches VALUES (824, 10, 26, 118, 2999, '24 HR', true, '25% OFF', 'Standard package offered by branch 26', true, '2026-05-28 16:06:54.26619', 25, 3999);
INSERT INTO public.lab_package_branches VALUES (825, 10, 27, 118, 3199, '48 HR', true, '25% OFF', 'Standard package offered by branch 27', true, '2026-05-28 16:06:54.267602', 25, 4266);
INSERT INTO public.lab_package_branches VALUES (826, 11, 28, 118, 2899, '24 HR', true, '25% OFF', 'Standard package offered by branch 28', true, '2026-05-28 16:06:54.268861', 25, 3866);
INSERT INTO public.lab_package_branches VALUES (827, 12, 29, 118, 3099, '48 HR', true, '25% OFF', 'Standard package offered by branch 29', true, '2026-05-28 16:06:54.270133', 25, 4132);
INSERT INTO public.lab_package_branches VALUES (828, 12, 30, 118, 2799, '24 HR', true, '25% OFF', 'Standard package offered by branch 30', true, '2026-05-28 16:06:54.271794', 25, 3732);
INSERT INTO public.lab_package_branches VALUES (829, 12, 31, 118, 2999, '48 HR', true, '25% OFF', 'Standard package offered by branch 31', true, '2026-05-28 16:06:54.273015', 25, 3999);
INSERT INTO public.lab_package_branches VALUES (830, 13, 32, 118, 3199, '24 HR', true, '25% OFF', 'Standard package offered by branch 32', true, '2026-05-28 16:06:54.274721', 25, 4266);
INSERT INTO public.lab_package_branches VALUES (831, 14, 33, 118, 2899, '48 HR', true, '25% OFF', 'Standard package offered by branch 33', true, '2026-05-28 16:06:54.276436', 25, 3866);
INSERT INTO public.lab_package_branches VALUES (832, 14, 34, 118, 3099, '24 HR', true, '25% OFF', 'Standard package offered by branch 34', true, '2026-05-28 16:06:54.277898', 25, 4132);
INSERT INTO public.lab_package_branches VALUES (833, 14, 35, 118, 2799, '48 HR', true, '25% OFF', 'Standard package offered by branch 35', true, '2026-05-28 16:06:54.279456', 25, 3732);
INSERT INTO public.lab_package_branches VALUES (834, 14, 36, 118, 2999, '24 HR', true, '25% OFF', 'Standard package offered by branch 36', true, '2026-05-28 16:06:54.280925', 25, 3999);
INSERT INTO public.lab_package_branches VALUES (835, 15, 37, 118, 3199, '48 HR', true, '25% OFF', 'Standard package offered by branch 37', true, '2026-05-28 16:06:54.282754', 25, 4266);
INSERT INTO public.lab_package_branches VALUES (836, 16, 38, 118, 2899, '24 HR', true, '25% OFF', 'Standard package offered by branch 38', true, '2026-05-28 16:06:54.284509', 25, 3866);
INSERT INTO public.lab_package_branches VALUES (837, 16, 39, 118, 3099, '48 HR', true, '25% OFF', 'Standard package offered by branch 39', true, '2026-05-28 16:06:54.285886', 25, 4132);
INSERT INTO public.lab_package_branches VALUES (838, 16, 40, 118, 2799, '24 HR', true, '25% OFF', 'Standard package offered by branch 40', true, '2026-05-28 16:06:54.2877', 25, 3732);
INSERT INTO public.lab_package_branches VALUES (839, 16, 41, 118, 2999, '48 HR', true, '25% OFF', 'Standard package offered by branch 41', true, '2026-05-28 16:06:54.289392', 25, 3999);
INSERT INTO public.lab_package_branches VALUES (840, 17, 42, 118, 3199, '24 HR', true, '25% OFF', 'Standard package offered by branch 42', true, '2026-05-28 16:06:54.291181', 25, 4266);
INSERT INTO public.lab_package_branches VALUES (841, 17, 43, 118, 2899, '48 HR', true, '25% OFF', 'Standard package offered by branch 43', true, '2026-05-28 16:06:54.292905', 25, 3866);
INSERT INTO public.lab_package_branches VALUES (842, 17, 44, 118, 3099, '24 HR', true, '25% OFF', 'Standard package offered by branch 44', true, '2026-05-28 16:06:54.294799', 25, 4132);
INSERT INTO public.lab_package_branches VALUES (843, 17, 45, 118, 2799, '48 HR', true, '25% OFF', 'Standard package offered by branch 45', true, '2026-05-28 16:06:54.296347', 25, 3732);
INSERT INTO public.lab_package_branches VALUES (844, 17, 46, 118, 2999, '24 HR', true, '25% OFF', 'Standard package offered by branch 46', true, '2026-05-28 16:06:54.297895', 25, 3999);
INSERT INTO public.lab_package_branches VALUES (846, 18, 48, 118, 2899, '24 HR', true, '25% OFF', 'Standard package offered by branch 48', true, '2026-05-28 16:06:54.301307', 25, 3866);
INSERT INTO public.lab_package_branches VALUES (847, 18, 49, 118, 3099, '48 HR', true, '25% OFF', 'Standard package offered by branch 49', true, '2026-05-28 16:06:54.303047', 25, 4132);
INSERT INTO public.lab_package_branches VALUES (848, 18, 50, 118, 2799, '24 HR', true, '25% OFF', 'Standard package offered by branch 50', true, '2026-05-28 16:06:54.305303', 25, 3732);
INSERT INTO public.lab_package_branches VALUES (849, 19, 51, 118, 2999, '48 HR', true, '25% OFF', 'Standard package offered by branch 51', true, '2026-05-28 16:06:54.307105', 25, 3999);
INSERT INTO public.lab_package_branches VALUES (850, 20, 52, 118, 3199, '24 HR', true, '25% OFF', 'Standard package offered by branch 52', true, '2026-05-28 16:06:54.309541', 25, 4266);
INSERT INTO public.lab_package_branches VALUES (851, 20, 53, 118, 2899, '48 HR', true, '25% OFF', 'Standard package offered by branch 53', true, '2026-05-28 16:06:54.311512', 25, 3866);
INSERT INTO public.lab_package_branches VALUES (852, 20, 54, 118, 3099, '24 HR', true, '25% OFF', 'Standard package offered by branch 54', true, '2026-05-28 16:06:54.313239', 25, 4132);
INSERT INTO public.lab_package_branches VALUES (853, 20, 55, 118, 2799, '48 HR', true, '25% OFF', 'Standard package offered by branch 55', true, '2026-05-28 16:06:54.315047', 25, 3732);
INSERT INTO public.lab_package_branches VALUES (854, 21, 56, 118, 2999, '24 HR', true, '25% OFF', 'Standard package offered by branch 56', true, '2026-05-28 16:06:54.317065', 25, 3999);
INSERT INTO public.lab_package_branches VALUES (855, 21, 57, 118, 3199, '48 HR', true, '25% OFF', 'Standard package offered by branch 57', true, '2026-05-28 16:06:54.320861', 25, 4266);
INSERT INTO public.lab_package_branches VALUES (856, 22, 58, 118, 2899, '24 HR', true, '25% OFF', 'Standard package offered by branch 58', true, '2026-05-28 16:06:54.322852', 25, 3866);
INSERT INTO public.lab_package_branches VALUES (857, 22, 59, 118, 3099, '48 HR', true, '25% OFF', 'Standard package offered by branch 59', true, '2026-05-28 16:06:54.325089', 25, 4132);
INSERT INTO public.lab_package_branches VALUES (858, 22, 60, 118, 2799, '24 HR', true, '25% OFF', 'Standard package offered by branch 60', true, '2026-05-28 16:06:54.327195', 25, 3732);
INSERT INTO public.lab_package_branches VALUES (859, 23, 61, 118, 2999, '48 HR', true, '25% OFF', 'Standard package offered by branch 61', true, '2026-05-28 16:06:54.329233', 25, 3999);
INSERT INTO public.lab_package_branches VALUES (860, 24, 62, 118, 3199, '24 HR', true, '25% OFF', 'Standard package offered by branch 62', true, '2026-05-28 16:06:54.330959', 25, 4266);
INSERT INTO public.lab_package_branches VALUES (861, 24, 63, 118, 2899, '48 HR', true, '25% OFF', 'Standard package offered by branch 63', true, '2026-05-28 16:06:54.332598', 25, 3866);
INSERT INTO public.lab_package_branches VALUES (862, 24, 64, 118, 3099, '24 HR', true, '25% OFF', 'Standard package offered by branch 64', true, '2026-05-28 16:06:54.334143', 25, 4132);
INSERT INTO public.lab_package_branches VALUES (863, 25, 65, 118, 2799, '48 HR', true, '25% OFF', 'Standard package offered by branch 65', true, '2026-05-28 16:06:54.335376', 25, 3732);
INSERT INTO public.lab_package_branches VALUES (864, 25, 66, 118, 2999, '24 HR', true, '25% OFF', 'Standard package offered by branch 66', true, '2026-05-28 16:06:54.33894', 25, 3999);
INSERT INTO public.lab_package_branches VALUES (865, 25, 67, 118, 3199, '48 HR', true, '25% OFF', 'Standard package offered by branch 67', true, '2026-05-28 16:06:54.340933', 25, 4266);
INSERT INTO public.lab_package_branches VALUES (866, 26, 68, 118, 2899, '24 HR', true, '25% OFF', 'Standard package offered by branch 68', true, '2026-05-28 16:06:54.342998', 25, 3866);
INSERT INTO public.lab_package_branches VALUES (867, 26, 69, 118, 3099, '48 HR', true, '25% OFF', 'Standard package offered by branch 69', true, '2026-05-28 16:06:54.346314', 25, 4132);
INSERT INTO public.lab_package_branches VALUES (868, 26, 70, 118, 2799, '24 HR', true, '25% OFF', 'Standard package offered by branch 70', true, '2026-05-28 16:06:54.347968', 25, 3732);
INSERT INTO public.lab_package_branches VALUES (869, 27, 71, 118, 2999, '48 HR', true, '25% OFF', 'Standard package offered by branch 71', true, '2026-05-28 16:06:54.349486', 25, 3999);
INSERT INTO public.lab_package_branches VALUES (870, 27, 72, 118, 3199, '24 HR', true, '25% OFF', 'Standard package offered by branch 72', true, '2026-05-28 16:06:54.351049', 25, 4266);
INSERT INTO public.lab_package_branches VALUES (871, 27, 73, 118, 2899, '48 HR', true, '25% OFF', 'Standard package offered by branch 73', true, '2026-05-28 16:06:54.352522', 25, 3866);
INSERT INTO public.lab_package_branches VALUES (872, 28, 74, 118, 3099, '24 HR', true, '25% OFF', 'Standard package offered by branch 74', true, '2026-05-28 16:06:54.354169', 25, 4132);
INSERT INTO public.lab_package_branches VALUES (873, 29, 75, 118, 2799, '48 HR', true, '25% OFF', 'Standard package offered by branch 75', true, '2026-05-28 16:06:54.355532', 25, 3732);
INSERT INTO public.lab_package_branches VALUES (874, 29, 76, 118, 2999, '24 HR', true, '25% OFF', 'Standard package offered by branch 76', true, '2026-05-28 16:06:54.358222', 25, 3999);
INSERT INTO public.lab_package_branches VALUES (875, 29, 77, 118, 3199, '48 HR', true, '25% OFF', 'Standard package offered by branch 77', true, '2026-05-28 16:06:54.360767', 25, 4266);
INSERT INTO public.lab_package_branches VALUES (877, 30, 79, 118, 3099, '48 HR', true, '25% OFF', 'Standard package offered by branch 79', true, '2026-05-28 16:06:54.364305', 25, 4132);
INSERT INTO public.lab_package_branches VALUES (878, 30, 80, 118, 2799, '24 HR', true, '25% OFF', 'Standard package offered by branch 80', true, '2026-05-28 16:06:54.36593', 25, 3732);
INSERT INTO public.lab_package_branches VALUES (879, 30, 81, 118, 2999, '48 HR', true, '25% OFF', 'Standard package offered by branch 81', true, '2026-05-28 16:06:54.367349', 25, 3999);
INSERT INTO public.lab_package_branches VALUES (880, 30, 82, 118, 3199, '24 HR', true, '25% OFF', 'Standard package offered by branch 82', true, '2026-05-28 16:06:54.368496', 25, 4266);
INSERT INTO public.lab_package_branches VALUES (881, 31, 83, 118, 2899, '48 HR', true, '25% OFF', 'Standard package offered by branch 83', true, '2026-05-28 16:06:54.36967', 25, 3866);
INSERT INTO public.lab_package_branches VALUES (883, 1, 2, 119, 2199, '24 HR', true, '20% OFF', 'Standard package offered by branch 2', true, '2026-05-28 16:06:54.371889', 20, 2749);
INSERT INTO public.lab_package_branches VALUES (884, 1, 3, 119, 1899, '48 HR', true, '20% OFF', 'Standard package offered by branch 3', true, '2026-05-28 16:06:54.372886', 20, 2374);
INSERT INTO public.lab_package_branches VALUES (885, 1, 4, 119, 2099, '24 HR', true, '20% OFF', 'Standard package offered by branch 4', true, '2026-05-28 16:06:54.374364', 20, 2624);
INSERT INTO public.lab_package_branches VALUES (821, 8, 23, 118, 2899, '48 HR', true, '25% OFF', 'Standard package offered by branch 23', true, '2026-05-28 16:06:54.261088', 25, 3866);
INSERT INTO public.lab_package_branches VALUES (891, 4, 10, 119, 1799, '24 HR', true, '20% OFF', 'Standard package offered by branch 10', true, '2026-05-28 16:06:54.383662', 20, 2249);
INSERT INTO public.lab_package_branches VALUES (892, 4, 11, 119, 1999, '48 HR', true, '20% OFF', 'Standard package offered by branch 11', true, '2026-05-28 16:06:54.38498', 20, 2499);
INSERT INTO public.lab_package_branches VALUES (893, 4, 12, 119, 2199, '24 HR', true, '20% OFF', 'Standard package offered by branch 12', true, '2026-05-28 16:06:54.386268', 20, 2749);
INSERT INTO public.lab_package_branches VALUES (894, 4, 13, 119, 1899, '48 HR', true, '20% OFF', 'Standard package offered by branch 13', true, '2026-05-28 16:06:54.387874', 20, 2374);
INSERT INTO public.lab_package_branches VALUES (895, 4, 14, 119, 2099, '24 HR', true, '20% OFF', 'Standard package offered by branch 14', true, '2026-05-28 16:06:54.389209', 20, 2624);
INSERT INTO public.lab_package_branches VALUES (896, 5, 15, 119, 1799, '48 HR', true, '20% OFF', 'Standard package offered by branch 15', true, '2026-05-28 16:06:54.390541', 20, 2249);
INSERT INTO public.lab_package_branches VALUES (897, 6, 16, 119, 1999, '24 HR', true, '20% OFF', 'Standard package offered by branch 16', true, '2026-05-28 16:06:54.391905', 20, 2499);
INSERT INTO public.lab_package_branches VALUES (898, 6, 17, 119, 2199, '48 HR', true, '20% OFF', 'Standard package offered by branch 17', true, '2026-05-28 16:06:54.393172', 20, 2749);
INSERT INTO public.lab_package_branches VALUES (899, 6, 18, 119, 1899, '24 HR', true, '20% OFF', 'Standard package offered by branch 18', true, '2026-05-28 16:06:54.39435', 20, 2374);
INSERT INTO public.lab_package_branches VALUES (900, 6, 19, 119, 2099, '48 HR', true, '20% OFF', 'Standard package offered by branch 19', true, '2026-05-28 16:06:54.395726', 20, 2624);
INSERT INTO public.lab_package_branches VALUES (901, 7, 20, 119, 1799, '24 HR', true, '20% OFF', 'Standard package offered by branch 20', true, '2026-05-28 16:06:54.397034', 20, 2249);
INSERT INTO public.lab_package_branches VALUES (902, 8, 21, 119, 1999, '48 HR', true, '20% OFF', 'Standard package offered by branch 21', true, '2026-05-28 16:06:54.398183', 20, 2499);
INSERT INTO public.lab_package_branches VALUES (903, 8, 22, 119, 2199, '24 HR', true, '20% OFF', 'Standard package offered by branch 22', true, '2026-05-28 16:06:54.399593', 20, 2749);
INSERT INTO public.lab_package_branches VALUES (904, 8, 23, 119, 1899, '48 HR', true, '20% OFF', 'Standard package offered by branch 23', true, '2026-05-28 16:06:54.400982', 20, 2374);
INSERT INTO public.lab_package_branches VALUES (905, 9, 24, 119, 2099, '24 HR', true, '20% OFF', 'Standard package offered by branch 24', true, '2026-05-28 16:06:54.427269', 20, 2624);
INSERT INTO public.lab_package_branches VALUES (906, 10, 25, 119, 1799, '48 HR', true, '20% OFF', 'Standard package offered by branch 25', true, '2026-05-28 16:06:54.47202', 20, 2249);
INSERT INTO public.lab_package_branches VALUES (907, 10, 26, 119, 1999, '24 HR', true, '20% OFF', 'Standard package offered by branch 26', true, '2026-05-28 16:06:54.47406', 20, 2499);
INSERT INTO public.lab_package_branches VALUES (908, 10, 27, 119, 2199, '48 HR', true, '20% OFF', 'Standard package offered by branch 27', true, '2026-05-28 16:06:54.483076', 20, 2749);
INSERT INTO public.lab_package_branches VALUES (909, 11, 28, 119, 1899, '24 HR', true, '20% OFF', 'Standard package offered by branch 28', true, '2026-05-28 16:06:54.485327', 20, 2374);
INSERT INTO public.lab_package_branches VALUES (910, 12, 29, 119, 2099, '48 HR', true, '20% OFF', 'Standard package offered by branch 29', true, '2026-05-28 16:06:54.487419', 20, 2624);
INSERT INTO public.lab_package_branches VALUES (911, 12, 30, 119, 1799, '24 HR', true, '20% OFF', 'Standard package offered by branch 30', true, '2026-05-28 16:06:54.489232', 20, 2249);
INSERT INTO public.lab_package_branches VALUES (912, 12, 31, 119, 1999, '48 HR', true, '20% OFF', 'Standard package offered by branch 31', true, '2026-05-28 16:06:54.49097', 20, 2499);
INSERT INTO public.lab_package_branches VALUES (913, 13, 32, 119, 2199, '24 HR', true, '20% OFF', 'Standard package offered by branch 32', true, '2026-05-28 16:06:54.492714', 20, 2749);
INSERT INTO public.lab_package_branches VALUES (915, 14, 34, 119, 2099, '24 HR', true, '20% OFF', 'Standard package offered by branch 34', true, '2026-05-28 16:06:54.496594', 20, 2624);
INSERT INTO public.lab_package_branches VALUES (916, 14, 35, 119, 1799, '48 HR', true, '20% OFF', 'Standard package offered by branch 35', true, '2026-05-28 16:06:54.498118', 20, 2249);
INSERT INTO public.lab_package_branches VALUES (917, 14, 36, 119, 1999, '24 HR', true, '20% OFF', 'Standard package offered by branch 36', true, '2026-05-28 16:06:54.499521', 20, 2499);
INSERT INTO public.lab_package_branches VALUES (918, 15, 37, 119, 2199, '48 HR', true, '20% OFF', 'Standard package offered by branch 37', true, '2026-05-28 16:06:54.501155', 20, 2749);
INSERT INTO public.lab_package_branches VALUES (919, 16, 38, 119, 1899, '24 HR', true, '20% OFF', 'Standard package offered by branch 38', true, '2026-05-28 16:06:54.502661', 20, 2374);
INSERT INTO public.lab_package_branches VALUES (920, 16, 39, 119, 2099, '48 HR', true, '20% OFF', 'Standard package offered by branch 39', true, '2026-05-28 16:06:54.504246', 20, 2624);
INSERT INTO public.lab_package_branches VALUES (921, 16, 40, 119, 1799, '24 HR', true, '20% OFF', 'Standard package offered by branch 40', true, '2026-05-28 16:06:54.505498', 20, 2249);
INSERT INTO public.lab_package_branches VALUES (922, 16, 41, 119, 1999, '48 HR', true, '20% OFF', 'Standard package offered by branch 41', true, '2026-05-28 16:06:54.506938', 20, 2499);
INSERT INTO public.lab_package_branches VALUES (923, 17, 42, 119, 2199, '24 HR', true, '20% OFF', 'Standard package offered by branch 42', true, '2026-05-28 16:06:54.508679', 20, 2749);
INSERT INTO public.lab_package_branches VALUES (924, 17, 43, 119, 1899, '48 HR', true, '20% OFF', 'Standard package offered by branch 43', true, '2026-05-28 16:06:54.510418', 20, 2374);
INSERT INTO public.lab_package_branches VALUES (925, 17, 44, 119, 2099, '24 HR', true, '20% OFF', 'Standard package offered by branch 44', true, '2026-05-28 16:06:54.517347', 20, 2624);
INSERT INTO public.lab_package_branches VALUES (926, 17, 45, 119, 1799, '48 HR', true, '20% OFF', 'Standard package offered by branch 45', true, '2026-05-28 16:06:54.520182', 20, 2249);
INSERT INTO public.lab_package_branches VALUES (927, 17, 46, 119, 1999, '24 HR', true, '20% OFF', 'Standard package offered by branch 46', true, '2026-05-28 16:06:54.522021', 20, 2499);
INSERT INTO public.lab_package_branches VALUES (928, 18, 47, 119, 2199, '48 HR', true, '20% OFF', 'Standard package offered by branch 47', true, '2026-05-28 16:06:54.523665', 20, 2749);
INSERT INTO public.lab_package_branches VALUES (929, 18, 48, 119, 1899, '24 HR', true, '20% OFF', 'Standard package offered by branch 48', true, '2026-05-28 16:06:54.525456', 20, 2374);
INSERT INTO public.lab_package_branches VALUES (930, 18, 49, 119, 2099, '48 HR', true, '20% OFF', 'Standard package offered by branch 49', true, '2026-05-28 16:06:54.527132', 20, 2624);
INSERT INTO public.lab_package_branches VALUES (931, 18, 50, 119, 1799, '24 HR', true, '20% OFF', 'Standard package offered by branch 50', true, '2026-05-28 16:06:54.528634', 20, 2249);
INSERT INTO public.lab_package_branches VALUES (932, 19, 51, 119, 1999, '48 HR', true, '20% OFF', 'Standard package offered by branch 51', true, '2026-05-28 16:06:54.530453', 20, 2499);
INSERT INTO public.lab_package_branches VALUES (933, 20, 52, 119, 2199, '24 HR', true, '20% OFF', 'Standard package offered by branch 52', true, '2026-05-28 16:06:54.532184', 20, 2749);
INSERT INTO public.lab_package_branches VALUES (934, 20, 53, 119, 1899, '48 HR', true, '20% OFF', 'Standard package offered by branch 53', true, '2026-05-28 16:06:54.533865', 20, 2374);
INSERT INTO public.lab_package_branches VALUES (935, 20, 54, 119, 2099, '24 HR', true, '20% OFF', 'Standard package offered by branch 54', true, '2026-05-28 16:06:54.535315', 20, 2624);
INSERT INTO public.lab_package_branches VALUES (936, 20, 55, 119, 1799, '48 HR', true, '20% OFF', 'Standard package offered by branch 55', true, '2026-05-28 16:06:54.536941', 20, 2249);
INSERT INTO public.lab_package_branches VALUES (937, 21, 56, 119, 1999, '24 HR', true, '20% OFF', 'Standard package offered by branch 56', true, '2026-05-28 16:06:54.538594', 20, 2499);
INSERT INTO public.lab_package_branches VALUES (938, 21, 57, 119, 2199, '48 HR', true, '20% OFF', 'Standard package offered by branch 57', true, '2026-05-28 16:06:54.540171', 20, 2749);
INSERT INTO public.lab_package_branches VALUES (939, 22, 58, 119, 1899, '24 HR', true, '20% OFF', 'Standard package offered by branch 58', true, '2026-05-28 16:06:54.541739', 20, 2374);
INSERT INTO public.lab_package_branches VALUES (940, 22, 59, 119, 2099, '48 HR', true, '20% OFF', 'Standard package offered by branch 59', true, '2026-05-28 16:06:54.543593', 20, 2624);
INSERT INTO public.lab_package_branches VALUES (941, 22, 60, 119, 1799, '24 HR', true, '20% OFF', 'Standard package offered by branch 60', true, '2026-05-28 16:06:54.545091', 20, 2249);
INSERT INTO public.lab_package_branches VALUES (942, 23, 61, 119, 1999, '48 HR', true, '20% OFF', 'Standard package offered by branch 61', true, '2026-05-28 16:06:54.546627', 20, 2499);
INSERT INTO public.lab_package_branches VALUES (943, 24, 62, 119, 2199, '24 HR', true, '20% OFF', 'Standard package offered by branch 62', true, '2026-05-28 16:06:54.548107', 20, 2749);
INSERT INTO public.lab_package_branches VALUES (944, 24, 63, 119, 1899, '48 HR', true, '20% OFF', 'Standard package offered by branch 63', true, '2026-05-28 16:06:54.549357', 20, 2374);
INSERT INTO public.lab_package_branches VALUES (946, 25, 65, 119, 1799, '48 HR', true, '20% OFF', 'Standard package offered by branch 65', true, '2026-05-28 16:06:54.552359', 20, 2249);
INSERT INTO public.lab_package_branches VALUES (947, 25, 66, 119, 1999, '24 HR', true, '20% OFF', 'Standard package offered by branch 66', true, '2026-05-28 16:06:54.553828', 20, 2499);
INSERT INTO public.lab_package_branches VALUES (948, 25, 67, 119, 2199, '48 HR', true, '20% OFF', 'Standard package offered by branch 67', true, '2026-05-28 16:06:54.555485', 20, 2749);
INSERT INTO public.lab_package_branches VALUES (949, 26, 68, 119, 1899, '24 HR', true, '20% OFF', 'Standard package offered by branch 68', true, '2026-05-28 16:06:54.557346', 20, 2374);
INSERT INTO public.lab_package_branches VALUES (950, 26, 69, 119, 2099, '48 HR', true, '20% OFF', 'Standard package offered by branch 69', true, '2026-05-28 16:06:54.558832', 20, 2624);
INSERT INTO public.lab_package_branches VALUES (887, 3, 6, 119, 1999, '24 HR', true, '20% OFF', 'Standard package offered by branch 6', true, '2026-05-28 16:06:54.378819', 20, 2499);
INSERT INTO public.lab_package_branches VALUES (888, 3, 7, 119, 2199, '48 HR', true, '20% OFF', 'Standard package offered by branch 7', true, '2026-05-28 16:06:54.380184', 20, 2749);
INSERT INTO public.lab_package_branches VALUES (889, 3, 8, 119, 1899, '24 HR', true, '20% OFF', 'Standard package offered by branch 8', true, '2026-05-28 16:06:54.381369', 20, 2374);
INSERT INTO public.lab_package_branches VALUES (890, 3, 9, 119, 2099, '48 HR', true, '20% OFF', 'Standard package offered by branch 9', true, '2026-05-28 16:06:54.38243', 20, 2624);
INSERT INTO public.lab_package_branches VALUES (956, 29, 75, 119, 1799, '48 HR', true, '20% OFF', 'Standard package offered by branch 75', true, '2026-05-28 16:06:54.570419', 20, 2249);
INSERT INTO public.lab_package_branches VALUES (957, 29, 76, 119, 1999, '24 HR', true, '20% OFF', 'Standard package offered by branch 76', true, '2026-05-28 16:06:54.572541', 20, 2499);
INSERT INTO public.lab_package_branches VALUES (958, 29, 77, 119, 2199, '48 HR', true, '20% OFF', 'Standard package offered by branch 77', true, '2026-05-28 16:06:54.574247', 20, 2749);
INSERT INTO public.lab_package_branches VALUES (959, 29, 78, 119, 1899, '24 HR', true, '20% OFF', 'Standard package offered by branch 78', true, '2026-05-28 16:06:54.576212', 20, 2374);
INSERT INTO public.lab_package_branches VALUES (960, 30, 79, 119, 2099, '48 HR', true, '20% OFF', 'Standard package offered by branch 79', true, '2026-05-28 16:06:54.577924', 20, 2624);
INSERT INTO public.lab_package_branches VALUES (961, 30, 80, 119, 1799, '24 HR', true, '20% OFF', 'Standard package offered by branch 80', true, '2026-05-28 16:06:54.579825', 20, 2249);
INSERT INTO public.lab_package_branches VALUES (962, 30, 81, 119, 1999, '48 HR', true, '20% OFF', 'Standard package offered by branch 81', true, '2026-05-28 16:06:54.582564', 20, 2499);
INSERT INTO public.lab_package_branches VALUES (963, 30, 82, 119, 2199, '24 HR', true, '20% OFF', 'Standard package offered by branch 82', true, '2026-05-28 16:06:54.584885', 20, 2749);
INSERT INTO public.lab_package_branches VALUES (964, 31, 83, 119, 1899, '48 HR', true, '20% OFF', 'Standard package offered by branch 83', true, '2026-05-28 16:06:54.586756', 20, 2374);
INSERT INTO public.lab_package_branches VALUES (965, 1, 1, 120, 1999, '48 HR', true, '20% OFF', 'Standard package offered by branch 1', true, '2026-05-28 16:06:54.588898', 20, 2499);
INSERT INTO public.lab_package_branches VALUES (966, 1, 2, 120, 2199, '24 HR', true, '20% OFF', 'Standard package offered by branch 2', true, '2026-05-28 16:06:54.591189', 20, 2749);
INSERT INTO public.lab_package_branches VALUES (967, 1, 3, 120, 1899, '48 HR', true, '20% OFF', 'Standard package offered by branch 3', true, '2026-05-28 16:06:54.593126', 20, 2374);
INSERT INTO public.lab_package_branches VALUES (954, 27, 73, 119, 1899, '48 HR', true, '20% OFF', 'Standard package offered by branch 73', true, '2026-05-28 16:06:54.566823', 20, 2374);
INSERT INTO public.lab_package_branches VALUES (969, 2, 5, 120, 1799, '48 HR', true, '20% OFF', 'Standard package offered by branch 5', true, '2026-05-28 16:06:54.596294', 20, 2249);
INSERT INTO public.lab_package_branches VALUES (970, 3, 6, 120, 1999, '24 HR', true, '20% OFF', 'Standard package offered by branch 6', true, '2026-05-28 16:06:54.597493', 20, 2499);
INSERT INTO public.lab_package_branches VALUES (971, 3, 7, 120, 2199, '48 HR', true, '20% OFF', 'Standard package offered by branch 7', true, '2026-05-28 16:06:54.598848', 20, 2749);
INSERT INTO public.lab_package_branches VALUES (972, 3, 8, 120, 1899, '24 HR', true, '20% OFF', 'Standard package offered by branch 8', true, '2026-05-28 16:06:54.600064', 20, 2374);
INSERT INTO public.lab_package_branches VALUES (973, 3, 9, 120, 2099, '48 HR', true, '20% OFF', 'Standard package offered by branch 9', true, '2026-05-28 16:06:54.601263', 20, 2624);
INSERT INTO public.lab_package_branches VALUES (974, 4, 10, 120, 1799, '24 HR', true, '20% OFF', 'Standard package offered by branch 10', true, '2026-05-28 16:06:54.602616', 20, 2249);
INSERT INTO public.lab_package_branches VALUES (975, 4, 11, 120, 1999, '48 HR', true, '20% OFF', 'Standard package offered by branch 11', true, '2026-05-28 16:06:54.604406', 20, 2499);
INSERT INTO public.lab_package_branches VALUES (976, 4, 12, 120, 2199, '24 HR', true, '20% OFF', 'Standard package offered by branch 12', true, '2026-05-28 16:06:54.60581', 20, 2749);
INSERT INTO public.lab_package_branches VALUES (977, 4, 13, 120, 1899, '48 HR', true, '20% OFF', 'Standard package offered by branch 13', true, '2026-05-28 16:06:54.60749', 20, 2374);
INSERT INTO public.lab_package_branches VALUES (978, 4, 14, 120, 2099, '24 HR', true, '20% OFF', 'Standard package offered by branch 14', true, '2026-05-28 16:06:54.608952', 20, 2624);
INSERT INTO public.lab_package_branches VALUES (980, 6, 16, 120, 1999, '24 HR', true, '20% OFF', 'Standard package offered by branch 16', true, '2026-05-28 16:06:54.612444', 20, 2499);
INSERT INTO public.lab_package_branches VALUES (981, 6, 17, 120, 2199, '48 HR', true, '20% OFF', 'Standard package offered by branch 17', true, '2026-05-28 16:06:54.613894', 20, 2749);
INSERT INTO public.lab_package_branches VALUES (982, 6, 18, 120, 1899, '24 HR', true, '20% OFF', 'Standard package offered by branch 18', true, '2026-05-28 16:06:54.615513', 20, 2374);
INSERT INTO public.lab_package_branches VALUES (983, 6, 19, 120, 2099, '48 HR', true, '20% OFF', 'Standard package offered by branch 19', true, '2026-05-28 16:06:54.617278', 20, 2624);
INSERT INTO public.lab_package_branches VALUES (984, 7, 20, 120, 1799, '24 HR', true, '20% OFF', 'Standard package offered by branch 20', true, '2026-05-28 16:06:54.61872', 20, 2249);
INSERT INTO public.lab_package_branches VALUES (985, 8, 21, 120, 1999, '48 HR', true, '20% OFF', 'Standard package offered by branch 21', true, '2026-05-28 16:06:54.623105', 20, 2499);
INSERT INTO public.lab_package_branches VALUES (986, 8, 22, 120, 2199, '24 HR', true, '20% OFF', 'Standard package offered by branch 22', true, '2026-05-28 16:06:54.625836', 20, 2749);
INSERT INTO public.lab_package_branches VALUES (987, 8, 23, 120, 1899, '48 HR', true, '20% OFF', 'Standard package offered by branch 23', true, '2026-05-28 16:06:54.629947', 20, 2374);
INSERT INTO public.lab_package_branches VALUES (988, 9, 24, 120, 2099, '24 HR', true, '20% OFF', 'Standard package offered by branch 24', true, '2026-05-28 16:06:54.632349', 20, 2624);
INSERT INTO public.lab_package_branches VALUES (989, 10, 25, 120, 1799, '48 HR', true, '20% OFF', 'Standard package offered by branch 25', true, '2026-05-28 16:06:54.635244', 20, 2249);
INSERT INTO public.lab_package_branches VALUES (990, 10, 26, 120, 1999, '24 HR', true, '20% OFF', 'Standard package offered by branch 26', true, '2026-05-28 16:06:54.638113', 20, 2499);
INSERT INTO public.lab_package_branches VALUES (991, 10, 27, 120, 2199, '48 HR', true, '20% OFF', 'Standard package offered by branch 27', true, '2026-05-28 16:06:54.640197', 20, 2749);
INSERT INTO public.lab_package_branches VALUES (992, 11, 28, 120, 1899, '24 HR', true, '20% OFF', 'Standard package offered by branch 28', true, '2026-05-28 16:06:54.64246', 20, 2374);
INSERT INTO public.lab_package_branches VALUES (993, 12, 29, 120, 2099, '48 HR', true, '20% OFF', 'Standard package offered by branch 29', true, '2026-05-28 16:06:54.644215', 20, 2624);
INSERT INTO public.lab_package_branches VALUES (994, 12, 30, 120, 1799, '24 HR', true, '20% OFF', 'Standard package offered by branch 30', true, '2026-05-28 16:06:54.64618', 20, 2249);
INSERT INTO public.lab_package_branches VALUES (995, 12, 31, 120, 1999, '48 HR', true, '20% OFF', 'Standard package offered by branch 31', true, '2026-05-28 16:06:54.647805', 20, 2499);
INSERT INTO public.lab_package_branches VALUES (996, 13, 32, 120, 2199, '24 HR', true, '20% OFF', 'Standard package offered by branch 32', true, '2026-05-28 16:06:54.649487', 20, 2749);
INSERT INTO public.lab_package_branches VALUES (997, 14, 33, 120, 1899, '48 HR', true, '20% OFF', 'Standard package offered by branch 33', true, '2026-05-28 16:06:54.651076', 20, 2374);
INSERT INTO public.lab_package_branches VALUES (998, 14, 34, 120, 2099, '24 HR', true, '20% OFF', 'Standard package offered by branch 34', true, '2026-05-28 16:06:54.652699', 20, 2624);
INSERT INTO public.lab_package_branches VALUES (999, 14, 35, 120, 1799, '48 HR', true, '20% OFF', 'Standard package offered by branch 35', true, '2026-05-28 16:06:54.654507', 20, 2249);
INSERT INTO public.lab_package_branches VALUES (1000, 14, 36, 120, 1999, '24 HR', true, '20% OFF', 'Standard package offered by branch 36', true, '2026-05-28 16:06:54.656074', 20, 2499);
INSERT INTO public.lab_package_branches VALUES (1001, 15, 37, 120, 2199, '48 HR', true, '20% OFF', 'Standard package offered by branch 37', true, '2026-05-28 16:06:54.659179', 20, 2749);
INSERT INTO public.lab_package_branches VALUES (1002, 16, 38, 120, 1899, '24 HR', true, '20% OFF', 'Standard package offered by branch 38', true, '2026-05-28 16:06:54.66132', 20, 2374);
INSERT INTO public.lab_package_branches VALUES (1003, 16, 39, 120, 2099, '48 HR', true, '20% OFF', 'Standard package offered by branch 39', true, '2026-05-28 16:06:54.663375', 20, 2624);
INSERT INTO public.lab_package_branches VALUES (1004, 16, 40, 120, 1799, '24 HR', true, '20% OFF', 'Standard package offered by branch 40', true, '2026-05-28 16:06:54.665488', 20, 2249);
INSERT INTO public.lab_package_branches VALUES (1005, 16, 41, 120, 1999, '48 HR', true, '20% OFF', 'Standard package offered by branch 41', true, '2026-05-28 16:06:54.667147', 20, 2499);
INSERT INTO public.lab_package_branches VALUES (1006, 17, 42, 120, 2199, '24 HR', true, '20% OFF', 'Standard package offered by branch 42', true, '2026-05-28 16:06:54.668666', 20, 2749);
INSERT INTO public.lab_package_branches VALUES (1007, 17, 43, 120, 1899, '48 HR', true, '20% OFF', 'Standard package offered by branch 43', true, '2026-05-28 16:06:54.670874', 20, 2374);
INSERT INTO public.lab_package_branches VALUES (1008, 17, 44, 120, 2099, '24 HR', true, '20% OFF', 'Standard package offered by branch 44', true, '2026-05-28 16:06:54.672457', 20, 2624);
INSERT INTO public.lab_package_branches VALUES (1009, 17, 45, 120, 1799, '48 HR', true, '20% OFF', 'Standard package offered by branch 45', true, '2026-05-28 16:06:54.675156', 20, 2249);
INSERT INTO public.lab_package_branches VALUES (1011, 18, 47, 120, 2199, '48 HR', true, '20% OFF', 'Standard package offered by branch 47', true, '2026-05-28 16:06:54.67882', 20, 2749);
INSERT INTO public.lab_package_branches VALUES (1012, 18, 48, 120, 1899, '24 HR', true, '20% OFF', 'Standard package offered by branch 48', true, '2026-05-28 16:06:54.680275', 20, 2374);
INSERT INTO public.lab_package_branches VALUES (1013, 18, 49, 120, 2099, '48 HR', true, '20% OFF', 'Standard package offered by branch 49', true, '2026-05-28 16:06:54.681805', 20, 2624);
INSERT INTO public.lab_package_branches VALUES (1014, 18, 50, 120, 1799, '24 HR', true, '20% OFF', 'Standard package offered by branch 50', true, '2026-05-28 16:06:54.683452', 20, 2249);
INSERT INTO public.lab_package_branches VALUES (1015, 19, 51, 120, 1999, '48 HR', true, '20% OFF', 'Standard package offered by branch 51', true, '2026-05-28 16:06:54.684955', 20, 2499);
INSERT INTO public.lab_package_branches VALUES (952, 27, 71, 119, 1999, '48 HR', true, '20% OFF', 'Standard package offered by branch 71', true, '2026-05-28 16:06:54.56283', 20, 2499);
INSERT INTO public.lab_package_branches VALUES (953, 27, 72, 119, 2199, '24 HR', true, '20% OFF', 'Standard package offered by branch 72', true, '2026-05-28 16:06:54.564544', 20, 2749);
INSERT INTO public.lab_package_branches VALUES (955, 28, 74, 119, 2099, '24 HR', true, '20% OFF', 'Standard package offered by branch 74', true, '2026-05-28 16:06:54.568677', 20, 2624);
INSERT INTO public.lab_package_branches VALUES (968, 1, 4, 120, 2099, '24 HR', true, '20% OFF', 'Standard package offered by branch 4', true, '2026-05-28 16:06:54.594725', 20, 2624);
INSERT INTO public.lab_package_branches VALUES (1021, 21, 57, 120, 2199, '48 HR', true, '20% OFF', 'Standard package offered by branch 57', true, '2026-05-28 16:06:54.694618', 20, 2749);
INSERT INTO public.lab_package_branches VALUES (1022, 22, 58, 120, 1899, '24 HR', true, '20% OFF', 'Standard package offered by branch 58', true, '2026-05-28 16:06:54.696252', 20, 2374);
INSERT INTO public.lab_package_branches VALUES (1023, 22, 59, 120, 2099, '48 HR', true, '20% OFF', 'Standard package offered by branch 59', true, '2026-05-28 16:06:54.69759', 20, 2624);
INSERT INTO public.lab_package_branches VALUES (1024, 22, 60, 120, 1799, '24 HR', true, '20% OFF', 'Standard package offered by branch 60', true, '2026-05-28 16:06:54.699068', 20, 2249);
INSERT INTO public.lab_package_branches VALUES (1025, 23, 61, 120, 1999, '48 HR', true, '20% OFF', 'Standard package offered by branch 61', true, '2026-05-28 16:06:54.700522', 20, 2499);
INSERT INTO public.lab_package_branches VALUES (1026, 24, 62, 120, 2199, '24 HR', true, '20% OFF', 'Standard package offered by branch 62', true, '2026-05-28 16:06:54.701854', 20, 2749);
INSERT INTO public.lab_package_branches VALUES (1027, 24, 63, 120, 1899, '48 HR', true, '20% OFF', 'Standard package offered by branch 63', true, '2026-05-28 16:06:54.703508', 20, 2374);
INSERT INTO public.lab_package_branches VALUES (1028, 24, 64, 120, 2099, '24 HR', true, '20% OFF', 'Standard package offered by branch 64', true, '2026-05-28 16:06:54.705495', 20, 2624);
INSERT INTO public.lab_package_branches VALUES (1029, 25, 65, 120, 1799, '48 HR', true, '20% OFF', 'Standard package offered by branch 65', true, '2026-05-28 16:06:54.707248', 20, 2249);
INSERT INTO public.lab_package_branches VALUES (1030, 25, 66, 120, 1999, '24 HR', true, '20% OFF', 'Standard package offered by branch 66', true, '2026-05-28 16:06:54.709698', 20, 2499);
INSERT INTO public.lab_package_branches VALUES (1031, 25, 67, 120, 2199, '48 HR', true, '20% OFF', 'Standard package offered by branch 67', true, '2026-05-28 16:06:54.711332', 20, 2749);
INSERT INTO public.lab_package_branches VALUES (1032, 26, 68, 120, 1899, '24 HR', true, '20% OFF', 'Standard package offered by branch 68', true, '2026-05-28 16:06:54.713001', 20, 2374);
INSERT INTO public.lab_package_branches VALUES (1033, 26, 69, 120, 2099, '48 HR', true, '20% OFF', 'Standard package offered by branch 69', true, '2026-05-28 16:06:54.714593', 20, 2624);
INSERT INTO public.lab_package_branches VALUES (1034, 26, 70, 120, 1799, '24 HR', true, '20% OFF', 'Standard package offered by branch 70', true, '2026-05-28 16:06:54.71588', 20, 2249);
INSERT INTO public.lab_package_branches VALUES (1035, 27, 71, 120, 1999, '48 HR', true, '20% OFF', 'Standard package offered by branch 71', true, '2026-05-28 16:06:54.71725', 20, 2499);
INSERT INTO public.lab_package_branches VALUES (1036, 27, 72, 120, 2199, '24 HR', true, '20% OFF', 'Standard package offered by branch 72', true, '2026-05-28 16:06:54.718784', 20, 2749);
INSERT INTO public.lab_package_branches VALUES (1037, 27, 73, 120, 1899, '48 HR', true, '20% OFF', 'Standard package offered by branch 73', true, '2026-05-28 16:06:54.720248', 20, 2374);
INSERT INTO public.lab_package_branches VALUES (1038, 28, 74, 120, 2099, '24 HR', true, '20% OFF', 'Standard package offered by branch 74', true, '2026-05-28 16:06:54.721707', 20, 2624);
INSERT INTO public.lab_package_branches VALUES (1039, 29, 75, 120, 1799, '48 HR', true, '20% OFF', 'Standard package offered by branch 75', true, '2026-05-28 16:06:54.723135', 20, 2249);
INSERT INTO public.lab_package_branches VALUES (1040, 29, 76, 120, 1999, '24 HR', true, '20% OFF', 'Standard package offered by branch 76', true, '2026-05-28 16:06:54.724988', 20, 2499);
INSERT INTO public.lab_package_branches VALUES (1041, 29, 77, 120, 2199, '48 HR', true, '20% OFF', 'Standard package offered by branch 77', true, '2026-05-28 16:06:54.726343', 20, 2749);
INSERT INTO public.lab_package_branches VALUES (1042, 29, 78, 120, 1899, '24 HR', true, '20% OFF', 'Standard package offered by branch 78', true, '2026-05-28 16:06:54.727615', 20, 2374);
INSERT INTO public.lab_package_branches VALUES (1043, 30, 79, 120, 2099, '48 HR', true, '20% OFF', 'Standard package offered by branch 79', true, '2026-05-28 16:06:54.728872', 20, 2624);
INSERT INTO public.lab_package_branches VALUES (1045, 30, 81, 120, 1999, '48 HR', true, '20% OFF', 'Standard package offered by branch 81', true, '2026-05-28 16:06:54.732055', 20, 2499);
INSERT INTO public.lab_package_branches VALUES (1046, 30, 82, 120, 2199, '24 HR', true, '20% OFF', 'Standard package offered by branch 82', true, '2026-05-28 16:06:54.733672', 20, 2749);
INSERT INTO public.lab_package_branches VALUES (1047, 31, 83, 120, 1899, '48 HR', true, '20% OFF', 'Standard package offered by branch 83', true, '2026-05-28 16:06:54.734942', 20, 2374);
INSERT INTO public.lab_package_branches VALUES (1048, 1, 1, 121, 1999, '48 HR', true, '20% OFF', 'Standard package offered by branch 1', true, '2026-05-28 16:06:54.736586', 20, 2499);
INSERT INTO public.lab_package_branches VALUES (1049, 1, 2, 121, 2199, '24 HR', true, '20% OFF', 'Standard package offered by branch 2', true, '2026-05-28 16:06:54.738134', 20, 2749);
INSERT INTO public.lab_package_branches VALUES (1018, 20, 54, 120, 2099, '24 HR', true, '20% OFF', 'Standard package offered by branch 54', true, '2026-05-28 16:06:54.689632', 20, 2624);
INSERT INTO public.lab_package_branches VALUES (1051, 1, 4, 121, 2099, '24 HR', true, '20% OFF', 'Standard package offered by branch 4', true, '2026-05-28 16:06:54.742199', 20, 2624);
INSERT INTO public.lab_package_branches VALUES (1052, 2, 5, 121, 1799, '48 HR', true, '20% OFF', 'Standard package offered by branch 5', true, '2026-05-28 16:06:54.744431', 20, 2249);
INSERT INTO public.lab_package_branches VALUES (1053, 3, 6, 121, 1999, '24 HR', true, '20% OFF', 'Standard package offered by branch 6', true, '2026-05-28 16:06:54.746676', 20, 2499);
INSERT INTO public.lab_package_branches VALUES (1054, 3, 7, 121, 2199, '48 HR', true, '20% OFF', 'Standard package offered by branch 7', true, '2026-05-28 16:06:54.74839', 20, 2749);
INSERT INTO public.lab_package_branches VALUES (1055, 3, 8, 121, 1899, '24 HR', true, '20% OFF', 'Standard package offered by branch 8', true, '2026-05-28 16:06:54.749829', 20, 2374);
INSERT INTO public.lab_package_branches VALUES (1056, 3, 9, 121, 2099, '48 HR', true, '20% OFF', 'Standard package offered by branch 9', true, '2026-05-28 16:06:54.751264', 20, 2624);
INSERT INTO public.lab_package_branches VALUES (1057, 4, 10, 121, 1799, '24 HR', true, '20% OFF', 'Standard package offered by branch 10', true, '2026-05-28 16:06:54.7526', 20, 2249);
INSERT INTO public.lab_package_branches VALUES (1058, 4, 11, 121, 1999, '48 HR', true, '20% OFF', 'Standard package offered by branch 11', true, '2026-05-28 16:06:54.753949', 20, 2499);
INSERT INTO public.lab_package_branches VALUES (1059, 4, 12, 121, 2199, '24 HR', true, '20% OFF', 'Standard package offered by branch 12', true, '2026-05-28 16:06:54.755379', 20, 2749);
INSERT INTO public.lab_package_branches VALUES (1060, 4, 13, 121, 1899, '48 HR', true, '20% OFF', 'Standard package offered by branch 13', true, '2026-05-28 16:06:54.756891', 20, 2374);
INSERT INTO public.lab_package_branches VALUES (1061, 4, 14, 121, 2099, '24 HR', true, '20% OFF', 'Standard package offered by branch 14', true, '2026-05-28 16:06:54.758968', 20, 2624);
INSERT INTO public.lab_package_branches VALUES (1062, 5, 15, 121, 1799, '48 HR', true, '20% OFF', 'Standard package offered by branch 15', true, '2026-05-28 16:06:54.76117', 20, 2249);
INSERT INTO public.lab_package_branches VALUES (1063, 6, 16, 121, 1999, '24 HR', true, '20% OFF', 'Standard package offered by branch 16', true, '2026-05-28 16:06:54.762583', 20, 2499);
INSERT INTO public.lab_package_branches VALUES (1064, 6, 17, 121, 2199, '48 HR', true, '20% OFF', 'Standard package offered by branch 17', true, '2026-05-28 16:06:54.764408', 20, 2749);
INSERT INTO public.lab_package_branches VALUES (1065, 6, 18, 121, 1899, '24 HR', true, '20% OFF', 'Standard package offered by branch 18', true, '2026-05-28 16:06:54.766052', 20, 2374);
INSERT INTO public.lab_package_branches VALUES (1066, 6, 19, 121, 2099, '48 HR', true, '20% OFF', 'Standard package offered by branch 19', true, '2026-05-28 16:06:54.767599', 20, 2624);
INSERT INTO public.lab_package_branches VALUES (1067, 7, 20, 121, 1799, '24 HR', true, '20% OFF', 'Standard package offered by branch 20', true, '2026-05-28 16:06:54.769229', 20, 2249);
INSERT INTO public.lab_package_branches VALUES (1068, 8, 21, 121, 1999, '48 HR', true, '20% OFF', 'Standard package offered by branch 21', true, '2026-05-28 16:06:54.770703', 20, 2499);
INSERT INTO public.lab_package_branches VALUES (1069, 8, 22, 121, 2199, '24 HR', true, '20% OFF', 'Standard package offered by branch 22', true, '2026-05-28 16:06:54.773543', 20, 2749);
INSERT INTO public.lab_package_branches VALUES (1070, 8, 23, 121, 1899, '48 HR', true, '20% OFF', 'Standard package offered by branch 23', true, '2026-05-28 16:06:54.775729', 20, 2374);
INSERT INTO public.lab_package_branches VALUES (1071, 9, 24, 121, 2099, '24 HR', true, '20% OFF', 'Standard package offered by branch 24', true, '2026-05-28 16:06:54.778335', 20, 2624);
INSERT INTO public.lab_package_branches VALUES (1072, 10, 25, 121, 1799, '48 HR', true, '20% OFF', 'Standard package offered by branch 25', true, '2026-05-28 16:06:54.780559', 20, 2249);
INSERT INTO public.lab_package_branches VALUES (1073, 10, 26, 121, 1999, '24 HR', true, '20% OFF', 'Standard package offered by branch 26', true, '2026-05-28 16:06:54.782894', 20, 2499);
INSERT INTO public.lab_package_branches VALUES (1074, 10, 27, 121, 2199, '48 HR', true, '20% OFF', 'Standard package offered by branch 27', true, '2026-05-28 16:06:54.784967', 20, 2749);
INSERT INTO public.lab_package_branches VALUES (1076, 12, 29, 121, 2099, '48 HR', true, '20% OFF', 'Standard package offered by branch 29', true, '2026-05-28 16:06:54.788689', 20, 2624);
INSERT INTO public.lab_package_branches VALUES (1077, 12, 30, 121, 1799, '24 HR', true, '20% OFF', 'Standard package offered by branch 30', true, '2026-05-28 16:06:54.790308', 20, 2249);
INSERT INTO public.lab_package_branches VALUES (1078, 12, 31, 121, 1999, '48 HR', true, '20% OFF', 'Standard package offered by branch 31', true, '2026-05-28 16:06:54.792004', 20, 2499);
INSERT INTO public.lab_package_branches VALUES (1079, 13, 32, 121, 2199, '24 HR', true, '20% OFF', 'Standard package offered by branch 32', true, '2026-05-28 16:06:54.793979', 20, 2749);
INSERT INTO public.lab_package_branches VALUES (1080, 14, 33, 121, 1899, '48 HR', true, '20% OFF', 'Standard package offered by branch 33', true, '2026-05-28 16:06:54.795662', 20, 2374);
INSERT INTO public.lab_package_branches VALUES (1017, 20, 53, 120, 1899, '48 HR', true, '20% OFF', 'Standard package offered by branch 53', true, '2026-05-28 16:06:54.688147', 20, 2374);
INSERT INTO public.lab_package_branches VALUES (1019, 20, 55, 120, 1799, '48 HR', true, '20% OFF', 'Standard package offered by branch 55', true, '2026-05-28 16:06:54.691414', 20, 2249);
INSERT INTO public.lab_package_branches VALUES (1050, 1, 3, 121, 1899, '48 HR', true, '20% OFF', 'Standard package offered by branch 3', true, '2026-05-28 16:06:54.739696', 20, 2374);
INSERT INTO public.lab_package_branches VALUES (1020, 21, 56, 120, 1999, '24 HR', true, '20% OFF', 'Standard package offered by branch 56', true, '2026-05-28 16:06:54.693118', 20, 2499);
INSERT INTO public.lab_package_branches VALUES (1086, 16, 39, 121, 2099, '48 HR', true, '20% OFF', 'Standard package offered by branch 39', true, '2026-05-28 16:06:54.805455', 20, 2624);
INSERT INTO public.lab_package_branches VALUES (1087, 16, 40, 121, 1799, '24 HR', true, '20% OFF', 'Standard package offered by branch 40', true, '2026-05-28 16:06:54.807277', 20, 2249);
INSERT INTO public.lab_package_branches VALUES (1088, 16, 41, 121, 1999, '48 HR', true, '20% OFF', 'Standard package offered by branch 41', true, '2026-05-28 16:06:54.809278', 20, 2499);
INSERT INTO public.lab_package_branches VALUES (1089, 17, 42, 121, 2199, '24 HR', true, '20% OFF', 'Standard package offered by branch 42', true, '2026-05-28 16:06:54.811171', 20, 2749);
INSERT INTO public.lab_package_branches VALUES (1090, 17, 43, 121, 1899, '48 HR', true, '20% OFF', 'Standard package offered by branch 43', true, '2026-05-28 16:06:54.812697', 20, 2374);
INSERT INTO public.lab_package_branches VALUES (1091, 17, 44, 121, 2099, '24 HR', true, '20% OFF', 'Standard package offered by branch 44', true, '2026-05-28 16:06:54.814296', 20, 2624);
INSERT INTO public.lab_package_branches VALUES (1092, 17, 45, 121, 1799, '48 HR', true, '20% OFF', 'Standard package offered by branch 45', true, '2026-05-28 16:06:54.815713', 20, 2249);
INSERT INTO public.lab_package_branches VALUES (1093, 17, 46, 121, 1999, '24 HR', true, '20% OFF', 'Standard package offered by branch 46', true, '2026-05-28 16:06:54.817144', 20, 2499);
INSERT INTO public.lab_package_branches VALUES (1094, 18, 47, 121, 2199, '48 HR', true, '20% OFF', 'Standard package offered by branch 47', true, '2026-05-28 16:06:54.818476', 20, 2749);
INSERT INTO public.lab_package_branches VALUES (1095, 18, 48, 121, 1899, '24 HR', true, '20% OFF', 'Standard package offered by branch 48', true, '2026-05-28 16:06:54.819952', 20, 2374);
INSERT INTO public.lab_package_branches VALUES (1096, 18, 49, 121, 2099, '48 HR', true, '20% OFF', 'Standard package offered by branch 49', true, '2026-05-28 16:06:54.821388', 20, 2624);
INSERT INTO public.lab_package_branches VALUES (1097, 18, 50, 121, 1799, '24 HR', true, '20% OFF', 'Standard package offered by branch 50', true, '2026-05-28 16:06:54.822815', 20, 2249);
INSERT INTO public.lab_package_branches VALUES (1098, 19, 51, 121, 1999, '48 HR', true, '20% OFF', 'Standard package offered by branch 51', true, '2026-05-28 16:06:54.82468', 20, 2499);
INSERT INTO public.lab_package_branches VALUES (1099, 20, 52, 121, 2199, '24 HR', true, '20% OFF', 'Standard package offered by branch 52', true, '2026-05-28 16:06:54.826805', 20, 2749);
INSERT INTO public.lab_package_branches VALUES (1100, 20, 53, 121, 1899, '48 HR', true, '20% OFF', 'Standard package offered by branch 53', true, '2026-05-28 16:06:54.82847', 20, 2374);
INSERT INTO public.lab_package_branches VALUES (1101, 20, 54, 121, 2099, '24 HR', true, '20% OFF', 'Standard package offered by branch 54', true, '2026-05-28 16:06:54.829962', 20, 2624);
INSERT INTO public.lab_package_branches VALUES (1102, 20, 55, 121, 1799, '48 HR', true, '20% OFF', 'Standard package offered by branch 55', true, '2026-05-28 16:06:54.831371', 20, 2249);
INSERT INTO public.lab_package_branches VALUES (1103, 21, 56, 121, 1999, '24 HR', true, '20% OFF', 'Standard package offered by branch 56', true, '2026-05-28 16:06:54.832828', 20, 2499);
INSERT INTO public.lab_package_branches VALUES (1104, 21, 57, 121, 2199, '48 HR', true, '20% OFF', 'Standard package offered by branch 57', true, '2026-05-28 16:06:54.834447', 20, 2749);
INSERT INTO public.lab_package_branches VALUES (1105, 22, 58, 121, 1899, '24 HR', true, '20% OFF', 'Standard package offered by branch 58', true, '2026-05-28 16:06:54.836182', 20, 2374);
INSERT INTO public.lab_package_branches VALUES (1106, 22, 59, 121, 2099, '48 HR', true, '20% OFF', 'Standard package offered by branch 59', true, '2026-05-28 16:06:54.837781', 20, 2624);
INSERT INTO public.lab_package_branches VALUES (1107, 22, 60, 121, 1799, '24 HR', true, '20% OFF', 'Standard package offered by branch 60', true, '2026-05-28 16:06:54.839176', 20, 2249);
INSERT INTO public.lab_package_branches VALUES (1108, 23, 61, 121, 1999, '48 HR', true, '20% OFF', 'Standard package offered by branch 61', true, '2026-05-28 16:06:54.84113', 20, 2499);
INSERT INTO public.lab_package_branches VALUES (1110, 24, 63, 121, 1899, '48 HR', true, '20% OFF', 'Standard package offered by branch 63', true, '2026-05-28 16:06:54.844149', 20, 2374);
INSERT INTO public.lab_package_branches VALUES (1111, 24, 64, 121, 2099, '24 HR', true, '20% OFF', 'Standard package offered by branch 64', true, '2026-05-28 16:06:54.845281', 20, 2624);
INSERT INTO public.lab_package_branches VALUES (1112, 25, 65, 121, 1799, '48 HR', true, '20% OFF', 'Standard package offered by branch 65', true, '2026-05-28 16:06:54.846383', 20, 2249);
INSERT INTO public.lab_package_branches VALUES (1113, 25, 66, 121, 1999, '24 HR', true, '20% OFF', 'Standard package offered by branch 66', true, '2026-05-28 16:06:54.847872', 20, 2499);
INSERT INTO public.lab_package_branches VALUES (1114, 25, 67, 121, 2199, '48 HR', true, '20% OFF', 'Standard package offered by branch 67', true, '2026-05-28 16:06:54.849086', 20, 2749);
INSERT INTO public.lab_package_branches VALUES (1115, 26, 68, 121, 1899, '24 HR', true, '20% OFF', 'Standard package offered by branch 68', true, '2026-05-28 16:06:54.850099', 20, 2374);
INSERT INTO public.lab_package_branches VALUES (1116, 26, 69, 121, 2099, '48 HR', true, '20% OFF', 'Standard package offered by branch 69', true, '2026-05-28 16:06:54.851298', 20, 2624);
INSERT INTO public.lab_package_branches VALUES (1117, 26, 70, 121, 1799, '24 HR', true, '20% OFF', 'Standard package offered by branch 70', true, '2026-05-28 16:06:54.852538', 20, 2249);
INSERT INTO public.lab_package_branches VALUES (1118, 27, 71, 121, 1999, '48 HR', true, '20% OFF', 'Standard package offered by branch 71', true, '2026-05-28 16:06:54.858765', 20, 2499);
INSERT INTO public.lab_package_branches VALUES (1119, 27, 72, 121, 2199, '24 HR', true, '20% OFF', 'Standard package offered by branch 72', true, '2026-05-28 16:06:54.860604', 20, 2749);
INSERT INTO public.lab_package_branches VALUES (1120, 27, 73, 121, 1899, '48 HR', true, '20% OFF', 'Standard package offered by branch 73', true, '2026-05-28 16:06:54.862633', 20, 2374);
INSERT INTO public.lab_package_branches VALUES (1121, 28, 74, 121, 2099, '24 HR', true, '20% OFF', 'Standard package offered by branch 74', true, '2026-05-28 16:06:54.864273', 20, 2624);
INSERT INTO public.lab_package_branches VALUES (1122, 29, 75, 121, 1799, '48 HR', true, '20% OFF', 'Standard package offered by branch 75', true, '2026-05-28 16:06:54.866022', 20, 2249);
INSERT INTO public.lab_package_branches VALUES (1123, 29, 76, 121, 1999, '24 HR', true, '20% OFF', 'Standard package offered by branch 76', true, '2026-05-28 16:06:54.867404', 20, 2499);
INSERT INTO public.lab_package_branches VALUES (1124, 29, 77, 121, 2199, '48 HR', true, '20% OFF', 'Standard package offered by branch 77', true, '2026-05-28 16:06:54.868854', 20, 2749);
INSERT INTO public.lab_package_branches VALUES (1125, 29, 78, 121, 1899, '24 HR', true, '20% OFF', 'Standard package offered by branch 78', true, '2026-05-28 16:06:54.870317', 20, 2374);
INSERT INTO public.lab_package_branches VALUES (1126, 30, 79, 121, 2099, '48 HR', true, '20% OFF', 'Standard package offered by branch 79', true, '2026-05-28 16:06:54.871855', 20, 2624);
INSERT INTO public.lab_package_branches VALUES (1127, 30, 80, 121, 1799, '24 HR', true, '20% OFF', 'Standard package offered by branch 80', true, '2026-05-28 16:06:54.873505', 20, 2249);
INSERT INTO public.lab_package_branches VALUES (1128, 30, 81, 121, 1999, '48 HR', true, '20% OFF', 'Standard package offered by branch 81', true, '2026-05-28 16:06:54.875533', 20, 2499);
INSERT INTO public.lab_package_branches VALUES (1129, 30, 82, 121, 2199, '24 HR', true, '20% OFF', 'Standard package offered by branch 82', true, '2026-05-28 16:06:54.877408', 20, 2749);
INSERT INTO public.lab_package_branches VALUES (1130, 31, 83, 121, 1899, '48 HR', true, '20% OFF', 'Standard package offered by branch 83', true, '2026-05-28 16:06:54.879374', 20, 2374);
INSERT INTO public.lab_package_branches VALUES (1131, 1, 1, 122, 999, '48 HR', true, '23% OFF', 'Standard package offered by branch 1', true, '2026-05-28 16:06:54.881174', 23, 1298);
INSERT INTO public.lab_package_branches VALUES (1082, 14, 35, 121, 1799, '48 HR', true, '20% OFF', 'Standard package offered by branch 35', true, '2026-05-28 16:06:54.799923', 20, 2249);
INSERT INTO public.lab_package_branches VALUES (1133, 1, 3, 122, 899, '48 HR', true, '23% OFF', 'Standard package offered by branch 3', true, '2026-05-28 16:06:54.885103', 23, 1168);
INSERT INTO public.lab_package_branches VALUES (1134, 1, 4, 122, 1099, '24 HR', true, '23% OFF', 'Standard package offered by branch 4', true, '2026-05-28 16:06:54.886885', 23, 1428);
INSERT INTO public.lab_package_branches VALUES (1135, 2, 5, 122, 799, '48 HR', true, '23% OFF', 'Standard package offered by branch 5', true, '2026-05-28 16:06:54.888401', 23, 1038);
INSERT INTO public.lab_package_branches VALUES (1136, 3, 6, 122, 999, '24 HR', true, '23% OFF', 'Standard package offered by branch 6', true, '2026-05-28 16:06:54.889868', 23, 1298);
INSERT INTO public.lab_package_branches VALUES (1137, 3, 7, 122, 1199, '48 HR', true, '23% OFF', 'Standard package offered by branch 7', true, '2026-05-28 16:06:54.892115', 23, 1558);
INSERT INTO public.lab_package_branches VALUES (1138, 3, 8, 122, 899, '24 HR', true, '23% OFF', 'Standard package offered by branch 8', true, '2026-05-28 16:06:54.895231', 23, 1168);
INSERT INTO public.lab_package_branches VALUES (1139, 3, 9, 122, 1099, '48 HR', true, '23% OFF', 'Standard package offered by branch 9', true, '2026-05-28 16:06:54.89695', 23, 1428);
INSERT INTO public.lab_package_branches VALUES (1141, 4, 11, 122, 999, '48 HR', true, '23% OFF', 'Standard package offered by branch 11', true, '2026-05-28 16:06:54.900269', 23, 1298);
INSERT INTO public.lab_package_branches VALUES (1142, 4, 12, 122, 1199, '24 HR', true, '23% OFF', 'Standard package offered by branch 12', true, '2026-05-28 16:06:54.901841', 23, 1558);
INSERT INTO public.lab_package_branches VALUES (1143, 4, 13, 122, 899, '48 HR', true, '23% OFF', 'Standard package offered by branch 13', true, '2026-05-28 16:06:54.90409', 23, 1168);
INSERT INTO public.lab_package_branches VALUES (1144, 4, 14, 122, 1099, '24 HR', true, '23% OFF', 'Standard package offered by branch 14', true, '2026-05-28 16:06:54.905529', 23, 1428);
INSERT INTO public.lab_package_branches VALUES (1145, 5, 15, 122, 799, '48 HR', true, '23% OFF', 'Standard package offered by branch 15', true, '2026-05-28 16:06:54.906694', 23, 1038);
INSERT INTO public.lab_package_branches VALUES (1083, 14, 36, 121, 1999, '24 HR', true, '20% OFF', 'Standard package offered by branch 36', true, '2026-05-28 16:06:54.801204', 20, 2499);
INSERT INTO public.lab_package_branches VALUES (1132, 1, 2, 122, 1199, '24 HR', true, '23% OFF', 'Standard package offered by branch 2', true, '2026-05-28 16:06:54.883198', 23, 1558);
INSERT INTO public.lab_package_branches VALUES (1084, 15, 37, 121, 2199, '48 HR', true, '20% OFF', 'Standard package offered by branch 37', true, '2026-05-28 16:06:54.802613', 20, 2749);
INSERT INTO public.lab_package_branches VALUES (1085, 16, 38, 121, 1899, '24 HR', true, '20% OFF', 'Standard package offered by branch 38', true, '2026-05-28 16:06:54.804016', 20, 2374);
INSERT INTO public.lab_package_branches VALUES (1151, 8, 21, 122, 999, '48 HR', true, '23% OFF', 'Standard package offered by branch 21', true, '2026-05-28 16:06:54.916134', 23, 1298);
INSERT INTO public.lab_package_branches VALUES (1152, 8, 22, 122, 1199, '24 HR', true, '23% OFF', 'Standard package offered by branch 22', true, '2026-05-28 16:06:54.917363', 23, 1558);
INSERT INTO public.lab_package_branches VALUES (1153, 8, 23, 122, 899, '48 HR', true, '23% OFF', 'Standard package offered by branch 23', true, '2026-05-28 16:06:54.918389', 23, 1168);
INSERT INTO public.lab_package_branches VALUES (1154, 9, 24, 122, 1099, '24 HR', true, '23% OFF', 'Standard package offered by branch 24', true, '2026-05-28 16:06:54.919606', 23, 1428);
INSERT INTO public.lab_package_branches VALUES (1155, 10, 25, 122, 799, '48 HR', true, '23% OFF', 'Standard package offered by branch 25', true, '2026-05-28 16:06:54.920639', 23, 1038);
INSERT INTO public.lab_package_branches VALUES (1156, 10, 26, 122, 999, '24 HR', true, '23% OFF', 'Standard package offered by branch 26', true, '2026-05-28 16:06:54.921719', 23, 1298);
INSERT INTO public.lab_package_branches VALUES (1157, 10, 27, 122, 1199, '48 HR', true, '23% OFF', 'Standard package offered by branch 27', true, '2026-05-28 16:06:54.922811', 23, 1558);
INSERT INTO public.lab_package_branches VALUES (1158, 11, 28, 122, 899, '24 HR', true, '23% OFF', 'Standard package offered by branch 28', true, '2026-05-28 16:06:54.924274', 23, 1168);
INSERT INTO public.lab_package_branches VALUES (1159, 12, 29, 122, 1099, '48 HR', true, '23% OFF', 'Standard package offered by branch 29', true, '2026-05-28 16:06:54.926168', 23, 1428);
INSERT INTO public.lab_package_branches VALUES (1160, 12, 30, 122, 799, '24 HR', true, '23% OFF', 'Standard package offered by branch 30', true, '2026-05-28 16:06:54.928421', 23, 1038);
INSERT INTO public.lab_package_branches VALUES (1161, 12, 31, 122, 999, '48 HR', true, '23% OFF', 'Standard package offered by branch 31', true, '2026-05-28 16:06:54.930393', 23, 1298);
INSERT INTO public.lab_package_branches VALUES (1162, 13, 32, 122, 1199, '24 HR', true, '23% OFF', 'Standard package offered by branch 32', true, '2026-05-28 16:06:54.932143', 23, 1558);
INSERT INTO public.lab_package_branches VALUES (1163, 14, 33, 122, 899, '48 HR', true, '23% OFF', 'Standard package offered by branch 33', true, '2026-05-28 16:06:54.933954', 23, 1168);
INSERT INTO public.lab_package_branches VALUES (1164, 14, 34, 122, 1099, '24 HR', true, '23% OFF', 'Standard package offered by branch 34', true, '2026-05-28 16:06:54.935557', 23, 1428);
INSERT INTO public.lab_package_branches VALUES (1165, 14, 35, 122, 799, '48 HR', true, '23% OFF', 'Standard package offered by branch 35', true, '2026-05-28 16:06:54.937132', 23, 1038);
INSERT INTO public.lab_package_branches VALUES (1166, 14, 36, 122, 999, '24 HR', true, '23% OFF', 'Standard package offered by branch 36', true, '2026-05-28 16:06:54.938805', 23, 1298);
INSERT INTO public.lab_package_branches VALUES (1167, 15, 37, 122, 1199, '48 HR', true, '23% OFF', 'Standard package offered by branch 37', true, '2026-05-28 16:06:54.941677', 23, 1558);
INSERT INTO public.lab_package_branches VALUES (1168, 16, 38, 122, 899, '24 HR', true, '23% OFF', 'Standard package offered by branch 38', true, '2026-05-28 16:06:54.944279', 23, 1168);
INSERT INTO public.lab_package_branches VALUES (1169, 16, 39, 122, 1099, '48 HR', true, '23% OFF', 'Standard package offered by branch 39', true, '2026-05-28 16:06:54.946464', 23, 1428);
INSERT INTO public.lab_package_branches VALUES (1170, 16, 40, 122, 799, '24 HR', true, '23% OFF', 'Standard package offered by branch 40', true, '2026-05-28 16:06:54.948257', 23, 1038);
INSERT INTO public.lab_package_branches VALUES (1171, 16, 41, 122, 999, '48 HR', true, '23% OFF', 'Standard package offered by branch 41', true, '2026-05-28 16:06:54.950314', 23, 1298);
INSERT INTO public.lab_package_branches VALUES (1172, 17, 42, 122, 1199, '24 HR', true, '23% OFF', 'Standard package offered by branch 42', true, '2026-05-28 16:06:54.952216', 23, 1558);
INSERT INTO public.lab_package_branches VALUES (1173, 17, 43, 122, 899, '48 HR', true, '23% OFF', 'Standard package offered by branch 43', true, '2026-05-28 16:06:54.954163', 23, 1168);
INSERT INTO public.lab_package_branches VALUES (1175, 17, 45, 122, 799, '48 HR', true, '23% OFF', 'Standard package offered by branch 45', true, '2026-05-28 16:06:54.957441', 23, 1038);
INSERT INTO public.lab_package_branches VALUES (1176, 17, 46, 122, 999, '24 HR', true, '23% OFF', 'Standard package offered by branch 46', true, '2026-05-28 16:06:54.959356', 23, 1298);
INSERT INTO public.lab_package_branches VALUES (1177, 18, 47, 122, 1199, '48 HR', true, '23% OFF', 'Standard package offered by branch 47', true, '2026-05-28 16:06:54.961394', 23, 1558);
INSERT INTO public.lab_package_branches VALUES (1178, 18, 48, 122, 899, '24 HR', true, '23% OFF', 'Standard package offered by branch 48', true, '2026-05-28 16:06:54.963214', 23, 1168);
INSERT INTO public.lab_package_branches VALUES (1179, 18, 49, 122, 1099, '48 HR', true, '23% OFF', 'Standard package offered by branch 49', true, '2026-05-28 16:06:54.964942', 23, 1428);
INSERT INTO public.lab_package_branches VALUES (1180, 18, 50, 122, 799, '24 HR', true, '23% OFF', 'Standard package offered by branch 50', true, '2026-05-28 16:06:54.966995', 23, 1038);
INSERT INTO public.lab_package_branches VALUES (1181, 19, 51, 122, 999, '48 HR', true, '23% OFF', 'Standard package offered by branch 51', true, '2026-05-28 16:06:54.968894', 23, 1298);
INSERT INTO public.lab_package_branches VALUES (1182, 20, 52, 122, 1199, '24 HR', true, '23% OFF', 'Standard package offered by branch 52', true, '2026-05-28 16:06:54.970338', 23, 1558);
INSERT INTO public.lab_package_branches VALUES (1183, 20, 53, 122, 899, '48 HR', true, '23% OFF', 'Standard package offered by branch 53', true, '2026-05-28 16:06:54.971973', 23, 1168);
INSERT INTO public.lab_package_branches VALUES (1184, 20, 54, 122, 1099, '24 HR', true, '23% OFF', 'Standard package offered by branch 54', true, '2026-05-28 16:06:54.973799', 23, 1428);
INSERT INTO public.lab_package_branches VALUES (1185, 20, 55, 122, 799, '48 HR', true, '23% OFF', 'Standard package offered by branch 55', true, '2026-05-28 16:06:54.975586', 23, 1038);
INSERT INTO public.lab_package_branches VALUES (1186, 21, 56, 122, 999, '24 HR', true, '23% OFF', 'Standard package offered by branch 56', true, '2026-05-28 16:06:54.977306', 23, 1298);
INSERT INTO public.lab_package_branches VALUES (1187, 21, 57, 122, 1199, '48 HR', true, '23% OFF', 'Standard package offered by branch 57', true, '2026-05-28 16:06:54.979093', 23, 1558);
INSERT INTO public.lab_package_branches VALUES (1188, 22, 58, 122, 899, '24 HR', true, '23% OFF', 'Standard package offered by branch 58', true, '2026-05-28 16:06:54.980952', 23, 1168);
INSERT INTO public.lab_package_branches VALUES (1189, 22, 59, 122, 1099, '48 HR', true, '23% OFF', 'Standard package offered by branch 59', true, '2026-05-28 16:06:54.982487', 23, 1428);
INSERT INTO public.lab_package_branches VALUES (1190, 22, 60, 122, 799, '24 HR', true, '23% OFF', 'Standard package offered by branch 60', true, '2026-05-28 16:06:54.984048', 23, 1038);
INSERT INTO public.lab_package_branches VALUES (1191, 23, 61, 122, 999, '48 HR', true, '23% OFF', 'Standard package offered by branch 61', true, '2026-05-28 16:06:54.985892', 23, 1298);
INSERT INTO public.lab_package_branches VALUES (1192, 24, 62, 122, 1199, '24 HR', true, '23% OFF', 'Standard package offered by branch 62', true, '2026-05-28 16:06:54.987767', 23, 1558);
INSERT INTO public.lab_package_branches VALUES (1193, 24, 63, 122, 899, '48 HR', true, '23% OFF', 'Standard package offered by branch 63', true, '2026-05-28 16:06:54.989729', 23, 1168);
INSERT INTO public.lab_package_branches VALUES (1194, 24, 64, 122, 1099, '24 HR', true, '23% OFF', 'Standard package offered by branch 64', true, '2026-05-28 16:06:54.992385', 23, 1428);
INSERT INTO public.lab_package_branches VALUES (1195, 25, 65, 122, 799, '48 HR', true, '23% OFF', 'Standard package offered by branch 65', true, '2026-05-28 16:06:54.994731', 23, 1038);
INSERT INTO public.lab_package_branches VALUES (1196, 25, 66, 122, 999, '24 HR', true, '23% OFF', 'Standard package offered by branch 66', true, '2026-05-28 16:06:54.996981', 23, 1298);
INSERT INTO public.lab_package_branches VALUES (1197, 25, 67, 122, 1199, '48 HR', true, '23% OFF', 'Standard package offered by branch 67', true, '2026-05-28 16:06:54.998784', 23, 1558);
INSERT INTO public.lab_package_branches VALUES (1198, 26, 68, 122, 899, '24 HR', true, '23% OFF', 'Standard package offered by branch 68', true, '2026-05-28 16:06:55.000363', 23, 1168);
INSERT INTO public.lab_package_branches VALUES (1199, 26, 69, 122, 1099, '48 HR', true, '23% OFF', 'Standard package offered by branch 69', true, '2026-05-28 16:06:55.001624', 23, 1428);
INSERT INTO public.lab_package_branches VALUES (1200, 26, 70, 122, 799, '24 HR', true, '23% OFF', 'Standard package offered by branch 70', true, '2026-05-28 16:06:55.003288', 23, 1038);
INSERT INTO public.lab_package_branches VALUES (1201, 27, 71, 122, 999, '48 HR', true, '23% OFF', 'Standard package offered by branch 71', true, '2026-05-28 16:06:55.00541', 23, 1298);
INSERT INTO public.lab_package_branches VALUES (1202, 27, 72, 122, 1199, '24 HR', true, '23% OFF', 'Standard package offered by branch 72', true, '2026-05-28 16:06:55.007756', 23, 1558);
INSERT INTO public.lab_package_branches VALUES (1203, 27, 73, 122, 899, '48 HR', true, '23% OFF', 'Standard package offered by branch 73', true, '2026-05-28 16:06:55.009889', 23, 1168);
INSERT INTO public.lab_package_branches VALUES (1204, 28, 74, 122, 1099, '24 HR', true, '23% OFF', 'Standard package offered by branch 74', true, '2026-05-28 16:06:55.011474', 23, 1428);
INSERT INTO public.lab_package_branches VALUES (1206, 29, 76, 122, 999, '24 HR', true, '23% OFF', 'Standard package offered by branch 76', true, '2026-05-28 16:06:55.016283', 23, 1298);
INSERT INTO public.lab_package_branches VALUES (1207, 29, 77, 122, 1199, '48 HR', true, '23% OFF', 'Standard package offered by branch 77', true, '2026-05-28 16:06:55.018826', 23, 1558);
INSERT INTO public.lab_package_branches VALUES (1208, 29, 78, 122, 899, '24 HR', true, '23% OFF', 'Standard package offered by branch 78', true, '2026-05-28 16:06:55.021163', 23, 1168);
INSERT INTO public.lab_package_branches VALUES (1209, 30, 79, 122, 1099, '48 HR', true, '23% OFF', 'Standard package offered by branch 79', true, '2026-05-28 16:06:55.023342', 23, 1428);
INSERT INTO public.lab_package_branches VALUES (1210, 30, 80, 122, 799, '24 HR', true, '23% OFF', 'Standard package offered by branch 80', true, '2026-05-28 16:06:55.025522', 23, 1038);
INSERT INTO public.lab_package_branches VALUES (1147, 6, 17, 122, 1199, '48 HR', true, '23% OFF', 'Standard package offered by branch 17', true, '2026-05-28 16:06:54.910563', 23, 1558);
INSERT INTO public.lab_package_branches VALUES (1148, 6, 18, 122, 899, '24 HR', true, '23% OFF', 'Standard package offered by branch 18', true, '2026-05-28 16:06:54.912103', 23, 1168);
INSERT INTO public.lab_package_branches VALUES (1149, 6, 19, 122, 1099, '48 HR', true, '23% OFF', 'Standard package offered by branch 19', true, '2026-05-28 16:06:54.913278', 23, 1428);
INSERT INTO public.lab_package_branches VALUES (1150, 7, 20, 122, 799, '24 HR', true, '23% OFF', 'Standard package offered by branch 20', true, '2026-05-28 16:06:54.914851', 23, 1038);
INSERT INTO public.lab_package_branches VALUES (1216, 1, 3, 123, 899, '48 HR', true, '23% OFF', 'Standard package offered by branch 3', true, '2026-05-28 16:06:55.039934', 23, 1168);
INSERT INTO public.lab_package_branches VALUES (1217, 1, 4, 123, 1099, '24 HR', true, '23% OFF', 'Standard package offered by branch 4', true, '2026-05-28 16:06:55.041775', 23, 1428);
INSERT INTO public.lab_package_branches VALUES (1218, 2, 5, 123, 799, '48 HR', true, '23% OFF', 'Standard package offered by branch 5', true, '2026-05-28 16:06:55.043427', 23, 1038);
INSERT INTO public.lab_package_branches VALUES (1219, 3, 6, 123, 999, '24 HR', true, '23% OFF', 'Standard package offered by branch 6', true, '2026-05-28 16:06:55.044784', 23, 1298);
INSERT INTO public.lab_package_branches VALUES (1220, 3, 7, 123, 1199, '48 HR', true, '23% OFF', 'Standard package offered by branch 7', true, '2026-05-28 16:06:55.046154', 23, 1558);
INSERT INTO public.lab_package_branches VALUES (1221, 3, 8, 123, 899, '24 HR', true, '23% OFF', 'Standard package offered by branch 8', true, '2026-05-28 16:06:55.048165', 23, 1168);
INSERT INTO public.lab_package_branches VALUES (1222, 3, 9, 123, 1099, '48 HR', true, '23% OFF', 'Standard package offered by branch 9', true, '2026-05-28 16:06:55.049698', 23, 1428);
INSERT INTO public.lab_package_branches VALUES (1223, 4, 10, 123, 799, '24 HR', true, '23% OFF', 'Standard package offered by branch 10', true, '2026-05-28 16:06:55.050961', 23, 1038);
INSERT INTO public.lab_package_branches VALUES (1224, 4, 11, 123, 999, '48 HR', true, '23% OFF', 'Standard package offered by branch 11', true, '2026-05-28 16:06:55.052189', 23, 1298);
INSERT INTO public.lab_package_branches VALUES (1225, 4, 12, 123, 1199, '24 HR', true, '23% OFF', 'Standard package offered by branch 12', true, '2026-05-28 16:06:55.053467', 23, 1558);
INSERT INTO public.lab_package_branches VALUES (1226, 4, 13, 123, 899, '48 HR', true, '23% OFF', 'Standard package offered by branch 13', true, '2026-05-28 16:06:55.054882', 23, 1168);
INSERT INTO public.lab_package_branches VALUES (1227, 4, 14, 123, 1099, '24 HR', true, '23% OFF', 'Standard package offered by branch 14', true, '2026-05-28 16:06:55.056291', 23, 1428);
INSERT INTO public.lab_package_branches VALUES (1228, 5, 15, 123, 799, '48 HR', true, '23% OFF', 'Standard package offered by branch 15', true, '2026-05-28 16:06:55.058802', 23, 1038);
INSERT INTO public.lab_package_branches VALUES (1229, 6, 16, 123, 999, '24 HR', true, '23% OFF', 'Standard package offered by branch 16', true, '2026-05-28 16:06:55.060518', 23, 1298);
INSERT INTO public.lab_package_branches VALUES (1230, 6, 17, 123, 1199, '48 HR', true, '23% OFF', 'Standard package offered by branch 17', true, '2026-05-28 16:06:55.062425', 23, 1558);
INSERT INTO public.lab_package_branches VALUES (1231, 6, 18, 123, 899, '24 HR', true, '23% OFF', 'Standard package offered by branch 18', true, '2026-05-28 16:06:55.064386', 23, 1168);
INSERT INTO public.lab_package_branches VALUES (1232, 6, 19, 123, 1099, '48 HR', true, '23% OFF', 'Standard package offered by branch 19', true, '2026-05-28 16:06:55.065847', 23, 1428);
INSERT INTO public.lab_package_branches VALUES (1233, 7, 20, 123, 799, '24 HR', true, '23% OFF', 'Standard package offered by branch 20', true, '2026-05-28 16:06:55.067097', 23, 1038);
INSERT INTO public.lab_package_branches VALUES (1234, 8, 21, 123, 999, '48 HR', true, '23% OFF', 'Standard package offered by branch 21', true, '2026-05-28 16:06:55.069023', 23, 1298);
INSERT INTO public.lab_package_branches VALUES (1235, 8, 22, 123, 1199, '24 HR', true, '23% OFF', 'Standard package offered by branch 22', true, '2026-05-28 16:06:55.070568', 23, 1558);
INSERT INTO public.lab_package_branches VALUES (1236, 8, 23, 123, 899, '48 HR', true, '23% OFF', 'Standard package offered by branch 23', true, '2026-05-28 16:06:55.071856', 23, 1168);
INSERT INTO public.lab_package_branches VALUES (1237, 9, 24, 123, 1099, '24 HR', true, '23% OFF', 'Standard package offered by branch 24', true, '2026-05-28 16:06:55.07323', 23, 1428);
INSERT INTO public.lab_package_branches VALUES (1238, 10, 25, 123, 799, '48 HR', true, '23% OFF', 'Standard package offered by branch 25', true, '2026-05-28 16:06:55.075165', 23, 1038);
INSERT INTO public.lab_package_branches VALUES (1240, 10, 27, 123, 1199, '48 HR', true, '23% OFF', 'Standard package offered by branch 27', true, '2026-05-28 16:06:55.079391', 23, 1558);
INSERT INTO public.lab_package_branches VALUES (1241, 11, 28, 123, 899, '24 HR', true, '23% OFF', 'Standard package offered by branch 28', true, '2026-05-28 16:06:55.080889', 23, 1168);
INSERT INTO public.lab_package_branches VALUES (1242, 12, 29, 123, 1099, '48 HR', true, '23% OFF', 'Standard package offered by branch 29', true, '2026-05-28 16:06:55.082375', 23, 1428);
INSERT INTO public.lab_package_branches VALUES (1243, 12, 30, 123, 799, '24 HR', true, '23% OFF', 'Standard package offered by branch 30', true, '2026-05-28 16:06:55.084329', 23, 1038);
INSERT INTO public.lab_package_branches VALUES (1244, 12, 31, 123, 999, '48 HR', true, '23% OFF', 'Standard package offered by branch 31', true, '2026-05-28 16:06:55.086132', 23, 1298);
INSERT INTO public.lab_package_branches VALUES (1245, 13, 32, 123, 1199, '24 HR', true, '23% OFF', 'Standard package offered by branch 32', true, '2026-05-28 16:06:55.087624', 23, 1558);
INSERT INTO public.lab_package_branches VALUES (1246, 14, 33, 123, 899, '48 HR', true, '23% OFF', 'Standard package offered by branch 33', true, '2026-05-28 16:06:55.088824', 23, 1168);
INSERT INTO public.lab_package_branches VALUES (1247, 14, 34, 123, 1099, '24 HR', true, '23% OFF', 'Standard package offered by branch 34', true, '2026-05-28 16:06:55.089991', 23, 1428);
INSERT INTO public.lab_package_branches VALUES (1248, 14, 35, 123, 799, '48 HR', true, '23% OFF', 'Standard package offered by branch 35', true, '2026-05-28 16:06:55.091599', 23, 1038);
INSERT INTO public.lab_package_branches VALUES (1249, 14, 36, 123, 999, '24 HR', true, '23% OFF', 'Standard package offered by branch 36', true, '2026-05-28 16:06:55.09348', 23, 1298);
INSERT INTO public.lab_package_branches VALUES (1250, 15, 37, 123, 1199, '48 HR', true, '23% OFF', 'Standard package offered by branch 37', true, '2026-05-28 16:06:55.095137', 23, 1558);
INSERT INTO public.lab_package_branches VALUES (1251, 16, 38, 123, 899, '24 HR', true, '23% OFF', 'Standard package offered by branch 38', true, '2026-05-28 16:06:55.096281', 23, 1168);
INSERT INTO public.lab_package_branches VALUES (1252, 16, 39, 123, 1099, '48 HR', true, '23% OFF', 'Standard package offered by branch 39', true, '2026-05-28 16:06:55.097433', 23, 1428);
INSERT INTO public.lab_package_branches VALUES (1253, 16, 40, 123, 799, '24 HR', true, '23% OFF', 'Standard package offered by branch 40', true, '2026-05-28 16:06:55.098615', 23, 1038);
INSERT INTO public.lab_package_branches VALUES (1254, 16, 41, 123, 999, '48 HR', true, '23% OFF', 'Standard package offered by branch 41', true, '2026-05-28 16:06:55.099895', 23, 1298);
INSERT INTO public.lab_package_branches VALUES (1255, 17, 42, 123, 1199, '24 HR', true, '23% OFF', 'Standard package offered by branch 42', true, '2026-05-28 16:06:55.101395', 23, 1558);
INSERT INTO public.lab_package_branches VALUES (1256, 17, 43, 123, 899, '48 HR', true, '23% OFF', 'Standard package offered by branch 43', true, '2026-05-28 16:06:55.102644', 23, 1168);
INSERT INTO public.lab_package_branches VALUES (1257, 17, 44, 123, 1099, '24 HR', true, '23% OFF', 'Standard package offered by branch 44', true, '2026-05-28 16:06:55.103728', 23, 1428);
INSERT INTO public.lab_package_branches VALUES (1258, 17, 45, 123, 799, '48 HR', true, '23% OFF', 'Standard package offered by branch 45', true, '2026-05-28 16:06:55.104759', 23, 1038);
INSERT INTO public.lab_package_branches VALUES (1259, 17, 46, 123, 999, '24 HR', true, '23% OFF', 'Standard package offered by branch 46', true, '2026-05-28 16:06:55.105926', 23, 1298);
INSERT INTO public.lab_package_branches VALUES (1260, 18, 47, 123, 1199, '48 HR', true, '23% OFF', 'Standard package offered by branch 47', true, '2026-05-28 16:06:55.107252', 23, 1558);
INSERT INTO public.lab_package_branches VALUES (1261, 18, 48, 123, 899, '24 HR', true, '23% OFF', 'Standard package offered by branch 48', true, '2026-05-28 16:06:55.108495', 23, 1168);
INSERT INTO public.lab_package_branches VALUES (1262, 18, 49, 123, 1099, '48 HR', true, '23% OFF', 'Standard package offered by branch 49', true, '2026-05-28 16:06:55.109947', 23, 1428);
INSERT INTO public.lab_package_branches VALUES (1263, 18, 50, 123, 799, '24 HR', true, '23% OFF', 'Standard package offered by branch 50', true, '2026-05-28 16:06:55.111546', 23, 1038);
INSERT INTO public.lab_package_branches VALUES (1264, 19, 51, 123, 999, '48 HR', true, '23% OFF', 'Standard package offered by branch 51', true, '2026-05-28 16:06:55.11262', 23, 1298);
INSERT INTO public.lab_package_branches VALUES (1265, 20, 52, 123, 1199, '24 HR', true, '23% OFF', 'Standard package offered by branch 52', true, '2026-05-28 16:06:55.113752', 23, 1558);
INSERT INTO public.lab_package_branches VALUES (1266, 20, 53, 123, 899, '48 HR', true, '23% OFF', 'Standard package offered by branch 53', true, '2026-05-28 16:06:55.115174', 23, 1168);
INSERT INTO public.lab_package_branches VALUES (1267, 20, 54, 123, 1099, '24 HR', true, '23% OFF', 'Standard package offered by branch 54', true, '2026-05-28 16:06:55.116367', 23, 1428);
INSERT INTO public.lab_package_branches VALUES (1268, 20, 55, 123, 799, '48 HR', true, '23% OFF', 'Standard package offered by branch 55', true, '2026-05-28 16:06:55.117701', 23, 1038);
INSERT INTO public.lab_package_branches VALUES (1269, 21, 56, 123, 999, '24 HR', true, '23% OFF', 'Standard package offered by branch 56', true, '2026-05-28 16:06:55.119132', 23, 1298);
INSERT INTO public.lab_package_branches VALUES (1271, 22, 58, 123, 899, '24 HR', true, '23% OFF', 'Standard package offered by branch 58', true, '2026-05-28 16:06:55.121593', 23, 1168);
INSERT INTO public.lab_package_branches VALUES (1272, 22, 59, 123, 1099, '48 HR', true, '23% OFF', 'Standard package offered by branch 59', true, '2026-05-28 16:06:55.123361', 23, 1428);
INSERT INTO public.lab_package_branches VALUES (1273, 22, 60, 123, 799, '24 HR', true, '23% OFF', 'Standard package offered by branch 60', true, '2026-05-28 16:06:55.125507', 23, 1038);
INSERT INTO public.lab_package_branches VALUES (1274, 23, 61, 123, 999, '48 HR', true, '23% OFF', 'Standard package offered by branch 61', true, '2026-05-28 16:06:55.127197', 23, 1298);
INSERT INTO public.lab_package_branches VALUES (1275, 24, 62, 123, 1199, '24 HR', true, '23% OFF', 'Standard package offered by branch 62', true, '2026-05-28 16:06:55.128504', 23, 1558);
INSERT INTO public.lab_package_branches VALUES (1212, 30, 82, 122, 1199, '24 HR', true, '23% OFF', 'Standard package offered by branch 82', true, '2026-05-28 16:06:55.030087', 23, 1558);
INSERT INTO public.lab_package_branches VALUES (1214, 1, 1, 123, 999, '48 HR', true, '23% OFF', 'Standard package offered by branch 1', true, '2026-05-28 16:06:55.034984', 23, 1298);
INSERT INTO public.lab_package_branches VALUES (1213, 31, 83, 122, 899, '48 HR', true, '23% OFF', 'Standard package offered by branch 83', true, '2026-05-28 16:06:55.032338', 23, 1168);
INSERT INTO public.lab_package_branches VALUES (1215, 1, 2, 123, 1199, '24 HR', true, '23% OFF', 'Standard package offered by branch 2', true, '2026-05-28 16:06:55.037805', 23, 1558);
INSERT INTO public.lab_package_branches VALUES (1281, 26, 68, 123, 899, '24 HR', true, '23% OFF', 'Standard package offered by branch 68', true, '2026-05-28 16:06:55.13749', 23, 1168);
INSERT INTO public.lab_package_branches VALUES (1282, 26, 69, 123, 1099, '48 HR', true, '23% OFF', 'Standard package offered by branch 69', true, '2026-05-28 16:06:55.138714', 23, 1428);
INSERT INTO public.lab_package_branches VALUES (1283, 26, 70, 123, 799, '24 HR', true, '23% OFF', 'Standard package offered by branch 70', true, '2026-05-28 16:06:55.1401', 23, 1038);
INSERT INTO public.lab_package_branches VALUES (1284, 27, 71, 123, 999, '48 HR', true, '23% OFF', 'Standard package offered by branch 71', true, '2026-05-28 16:06:55.141473', 23, 1298);
INSERT INTO public.lab_package_branches VALUES (1285, 27, 72, 123, 1199, '24 HR', true, '23% OFF', 'Standard package offered by branch 72', true, '2026-05-28 16:06:55.143144', 23, 1558);
INSERT INTO public.lab_package_branches VALUES (1286, 27, 73, 123, 899, '48 HR', true, '23% OFF', 'Standard package offered by branch 73', true, '2026-05-28 16:06:55.145047', 23, 1168);
INSERT INTO public.lab_package_branches VALUES (1287, 28, 74, 123, 1099, '24 HR', true, '23% OFF', 'Standard package offered by branch 74', true, '2026-05-28 16:06:55.14708', 23, 1428);
INSERT INTO public.lab_package_branches VALUES (1288, 29, 75, 123, 799, '48 HR', true, '23% OFF', 'Standard package offered by branch 75', true, '2026-05-28 16:06:55.148672', 23, 1038);
INSERT INTO public.lab_package_branches VALUES (1289, 29, 76, 123, 999, '24 HR', true, '23% OFF', 'Standard package offered by branch 76', true, '2026-05-28 16:06:55.150442', 23, 1298);
INSERT INTO public.lab_package_branches VALUES (1290, 29, 77, 123, 1199, '48 HR', true, '23% OFF', 'Standard package offered by branch 77', true, '2026-05-28 16:06:55.152188', 23, 1558);
INSERT INTO public.lab_package_branches VALUES (1291, 29, 78, 123, 899, '24 HR', true, '23% OFF', 'Standard package offered by branch 78', true, '2026-05-28 16:06:55.153626', 23, 1168);
INSERT INTO public.lab_package_branches VALUES (1292, 30, 79, 123, 1099, '48 HR', true, '23% OFF', 'Standard package offered by branch 79', true, '2026-05-28 16:06:55.154887', 23, 1428);
INSERT INTO public.lab_package_branches VALUES (1293, 30, 80, 123, 799, '24 HR', true, '23% OFF', 'Standard package offered by branch 80', true, '2026-05-28 16:06:55.156117', 23, 1038);
INSERT INTO public.lab_package_branches VALUES (1294, 30, 81, 123, 999, '48 HR', true, '23% OFF', 'Standard package offered by branch 81', true, '2026-05-28 16:06:55.157405', 23, 1298);
INSERT INTO public.lab_package_branches VALUES (1295, 30, 82, 123, 1199, '24 HR', true, '23% OFF', 'Standard package offered by branch 82', true, '2026-05-28 16:06:55.158753', 23, 1558);
INSERT INTO public.lab_package_branches VALUES (1296, 31, 83, 123, 899, '48 HR', true, '23% OFF', 'Standard package offered by branch 83', true, '2026-05-28 16:06:55.160583', 23, 1168);
INSERT INTO public.lab_package_branches VALUES (1297, 1, 1, 124, 1499, '48 HR', true, '25% OFF', 'Standard package offered by branch 1', true, '2026-05-28 16:06:55.161912', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (1298, 1, 2, 124, 1699, '24 HR', true, '25% OFF', 'Standard package offered by branch 2', true, '2026-05-28 16:06:55.163688', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (1299, 1, 3, 124, 1399, '48 HR', true, '25% OFF', 'Standard package offered by branch 3', true, '2026-05-28 16:06:55.165058', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (1300, 1, 4, 124, 1599, '24 HR', true, '25% OFF', 'Standard package offered by branch 4', true, '2026-05-28 16:06:55.16656', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (1301, 2, 5, 124, 1299, '48 HR', true, '25% OFF', 'Standard package offered by branch 5', true, '2026-05-28 16:06:55.168077', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (1302, 3, 6, 124, 1499, '24 HR', true, '25% OFF', 'Standard package offered by branch 6', true, '2026-05-28 16:06:55.169513', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (1303, 3, 7, 124, 1699, '48 HR', true, '25% OFF', 'Standard package offered by branch 7', true, '2026-05-28 16:06:55.171078', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (1305, 3, 9, 124, 1599, '48 HR', true, '25% OFF', 'Standard package offered by branch 9', true, '2026-05-28 16:06:55.174221', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (1306, 4, 10, 124, 1299, '24 HR', true, '25% OFF', 'Standard package offered by branch 10', true, '2026-05-28 16:06:55.175682', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (1307, 4, 11, 124, 1499, '48 HR', true, '25% OFF', 'Standard package offered by branch 11', true, '2026-05-28 16:06:55.177225', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (1308, 4, 12, 124, 1699, '24 HR', true, '25% OFF', 'Standard package offered by branch 12', true, '2026-05-28 16:06:55.178568', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (1309, 4, 13, 124, 1399, '48 HR', true, '25% OFF', 'Standard package offered by branch 13', true, '2026-05-28 16:06:55.179926', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (1310, 4, 14, 124, 1599, '24 HR', true, '25% OFF', 'Standard package offered by branch 14', true, '2026-05-28 16:06:55.181397', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (1311, 5, 15, 124, 1299, '48 HR', true, '25% OFF', 'Standard package offered by branch 15', true, '2026-05-28 16:06:55.182602', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (1312, 6, 16, 124, 1499, '24 HR', true, '25% OFF', 'Standard package offered by branch 16', true, '2026-05-28 16:06:55.184182', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (1313, 6, 17, 124, 1699, '48 HR', true, '25% OFF', 'Standard package offered by branch 17', true, '2026-05-28 16:06:55.185493', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (1314, 6, 18, 124, 1399, '24 HR', true, '25% OFF', 'Standard package offered by branch 18', true, '2026-05-28 16:06:55.186848', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (1315, 6, 19, 124, 1599, '48 HR', true, '25% OFF', 'Standard package offered by branch 19', true, '2026-05-28 16:06:55.188076', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (1316, 7, 20, 124, 1299, '24 HR', true, '25% OFF', 'Standard package offered by branch 20', true, '2026-05-28 16:06:55.189212', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (1317, 8, 21, 124, 1499, '48 HR', true, '25% OFF', 'Standard package offered by branch 21', true, '2026-05-28 16:06:55.190452', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (1318, 8, 22, 124, 1699, '24 HR', true, '25% OFF', 'Standard package offered by branch 22', true, '2026-05-28 16:06:55.191752', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (1319, 8, 23, 124, 1399, '48 HR', true, '25% OFF', 'Standard package offered by branch 23', true, '2026-05-28 16:06:55.192896', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (1320, 9, 24, 124, 1599, '24 HR', true, '25% OFF', 'Standard package offered by branch 24', true, '2026-05-28 16:06:55.193909', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (1321, 10, 25, 124, 1299, '48 HR', true, '25% OFF', 'Standard package offered by branch 25', true, '2026-05-28 16:06:55.195015', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (1322, 10, 26, 124, 1499, '24 HR', true, '25% OFF', 'Standard package offered by branch 26', true, '2026-05-28 16:06:55.196329', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (1323, 10, 27, 124, 1699, '48 HR', true, '25% OFF', 'Standard package offered by branch 27', true, '2026-05-28 16:06:55.197418', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (1324, 11, 28, 124, 1399, '24 HR', true, '25% OFF', 'Standard package offered by branch 28', true, '2026-05-28 16:06:55.198448', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (1325, 12, 29, 124, 1599, '48 HR', true, '25% OFF', 'Standard package offered by branch 29', true, '2026-05-28 16:06:55.199882', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (1326, 12, 30, 124, 1299, '24 HR', true, '25% OFF', 'Standard package offered by branch 30', true, '2026-05-28 16:06:55.201204', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (1327, 12, 31, 124, 1499, '48 HR', true, '25% OFF', 'Standard package offered by branch 31', true, '2026-05-28 16:06:55.206681', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (1328, 13, 32, 124, 1699, '24 HR', true, '25% OFF', 'Standard package offered by branch 32', true, '2026-05-28 16:06:55.209051', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (1329, 14, 33, 124, 1399, '48 HR', true, '25% OFF', 'Standard package offered by branch 33', true, '2026-05-28 16:06:55.211379', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (1330, 14, 34, 124, 1599, '24 HR', true, '25% OFF', 'Standard package offered by branch 34', true, '2026-05-28 16:06:55.213015', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (1331, 14, 35, 124, 1299, '48 HR', true, '25% OFF', 'Standard package offered by branch 35', true, '2026-05-28 16:06:55.214344', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (1332, 14, 36, 124, 1499, '24 HR', true, '25% OFF', 'Standard package offered by branch 36', true, '2026-05-28 16:06:55.215805', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (1333, 15, 37, 124, 1699, '48 HR', true, '25% OFF', 'Standard package offered by branch 37', true, '2026-05-28 16:06:55.217488', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (1334, 16, 38, 124, 1399, '24 HR', true, '25% OFF', 'Standard package offered by branch 38', true, '2026-05-28 16:06:55.21891', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (1336, 16, 40, 124, 1299, '24 HR', true, '25% OFF', 'Standard package offered by branch 40', true, '2026-05-28 16:06:55.221666', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (1337, 16, 41, 124, 1499, '48 HR', true, '25% OFF', 'Standard package offered by branch 41', true, '2026-05-28 16:06:55.222971', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (1338, 17, 42, 124, 1699, '24 HR', true, '25% OFF', 'Standard package offered by branch 42', true, '2026-05-28 16:06:55.224476', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (1339, 17, 43, 124, 1399, '48 HR', true, '25% OFF', 'Standard package offered by branch 43', true, '2026-05-28 16:06:55.226184', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (1340, 17, 44, 124, 1599, '24 HR', true, '25% OFF', 'Standard package offered by branch 44', true, '2026-05-28 16:06:55.227598', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (1277, 24, 64, 123, 1099, '24 HR', true, '23% OFF', 'Standard package offered by branch 64', true, '2026-05-28 16:06:55.131587', 23, 1428);
INSERT INTO public.lab_package_branches VALUES (1278, 25, 65, 123, 799, '48 HR', true, '23% OFF', 'Standard package offered by branch 65', true, '2026-05-28 16:06:55.132888', 23, 1038);
INSERT INTO public.lab_package_branches VALUES (1279, 25, 66, 123, 999, '24 HR', true, '23% OFF', 'Standard package offered by branch 66', true, '2026-05-28 16:06:55.134364', 23, 1298);
INSERT INTO public.lab_package_branches VALUES (1280, 25, 67, 123, 1199, '48 HR', true, '23% OFF', 'Standard package offered by branch 67', true, '2026-05-28 16:06:55.13613', 23, 1558);
INSERT INTO public.lab_package_branches VALUES (1346, 18, 50, 124, 1299, '24 HR', true, '25% OFF', 'Standard package offered by branch 50', true, '2026-05-28 16:06:55.23798', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (1347, 19, 51, 124, 1499, '48 HR', true, '25% OFF', 'Standard package offered by branch 51', true, '2026-05-28 16:06:55.239377', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (1348, 20, 52, 124, 1699, '24 HR', true, '25% OFF', 'Standard package offered by branch 52', true, '2026-05-28 16:06:55.241112', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (1349, 20, 53, 124, 1399, '48 HR', true, '25% OFF', 'Standard package offered by branch 53', true, '2026-05-28 16:06:55.2428', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (1350, 20, 54, 124, 1599, '24 HR', true, '25% OFF', 'Standard package offered by branch 54', true, '2026-05-28 16:06:55.244284', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (1351, 20, 55, 124, 1299, '48 HR', true, '25% OFF', 'Standard package offered by branch 55', true, '2026-05-28 16:06:55.245981', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (1352, 21, 56, 124, 1499, '24 HR', true, '25% OFF', 'Standard package offered by branch 56', true, '2026-05-28 16:06:55.247552', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (1353, 21, 57, 124, 1699, '48 HR', true, '25% OFF', 'Standard package offered by branch 57', true, '2026-05-28 16:06:55.249677', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (1354, 22, 58, 124, 1399, '24 HR', true, '25% OFF', 'Standard package offered by branch 58', true, '2026-05-28 16:06:55.251017', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (1355, 22, 59, 124, 1599, '48 HR', true, '25% OFF', 'Standard package offered by branch 59', true, '2026-05-28 16:06:55.252194', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (1356, 22, 60, 124, 1299, '24 HR', true, '25% OFF', 'Standard package offered by branch 60', true, '2026-05-28 16:06:55.253434', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (1357, 23, 61, 124, 1499, '48 HR', true, '25% OFF', 'Standard package offered by branch 61', true, '2026-05-28 16:06:55.254827', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (1358, 24, 62, 124, 1699, '24 HR', true, '25% OFF', 'Standard package offered by branch 62', true, '2026-05-28 16:06:55.256163', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (1359, 24, 63, 124, 1399, '48 HR', true, '25% OFF', 'Standard package offered by branch 63', true, '2026-05-28 16:06:55.257858', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (1360, 24, 64, 124, 1599, '24 HR', true, '25% OFF', 'Standard package offered by branch 64', true, '2026-05-28 16:06:55.25991', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (1361, 25, 65, 124, 1299, '48 HR', true, '25% OFF', 'Standard package offered by branch 65', true, '2026-05-28 16:06:55.261589', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (1362, 25, 66, 124, 1499, '24 HR', true, '25% OFF', 'Standard package offered by branch 66', true, '2026-05-28 16:06:55.263141', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (1363, 25, 67, 124, 1699, '48 HR', true, '25% OFF', 'Standard package offered by branch 67', true, '2026-05-28 16:06:55.264963', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (1364, 26, 68, 124, 1399, '24 HR', true, '25% OFF', 'Standard package offered by branch 68', true, '2026-05-28 16:06:55.266453', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (1365, 26, 69, 124, 1599, '48 HR', true, '25% OFF', 'Standard package offered by branch 69', true, '2026-05-28 16:06:55.268025', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (1366, 26, 70, 124, 1299, '24 HR', true, '25% OFF', 'Standard package offered by branch 70', true, '2026-05-28 16:06:55.269952', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (1367, 27, 71, 124, 1499, '48 HR', true, '25% OFF', 'Standard package offered by branch 71', true, '2026-05-28 16:06:55.272617', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (1368, 27, 72, 124, 1699, '24 HR', true, '25% OFF', 'Standard package offered by branch 72', true, '2026-05-28 16:06:55.275077', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (1370, 28, 74, 124, 1599, '24 HR', true, '25% OFF', 'Standard package offered by branch 74', true, '2026-05-28 16:06:55.279481', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (1371, 29, 75, 124, 1299, '48 HR', true, '25% OFF', 'Standard package offered by branch 75', true, '2026-05-28 16:06:55.281564', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (1372, 29, 76, 124, 1499, '24 HR', true, '25% OFF', 'Standard package offered by branch 76', true, '2026-05-28 16:06:55.283314', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (1373, 29, 77, 124, 1699, '48 HR', true, '25% OFF', 'Standard package offered by branch 77', true, '2026-05-28 16:06:55.285181', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (1374, 29, 78, 124, 1399, '24 HR', true, '25% OFF', 'Standard package offered by branch 78', true, '2026-05-28 16:06:55.286817', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (1375, 30, 79, 124, 1599, '48 HR', true, '25% OFF', 'Standard package offered by branch 79', true, '2026-05-28 16:06:55.288775', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (1376, 30, 80, 124, 1299, '24 HR', true, '25% OFF', 'Standard package offered by branch 80', true, '2026-05-28 16:06:55.29061', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (1377, 30, 81, 124, 1499, '48 HR', true, '25% OFF', 'Standard package offered by branch 81', true, '2026-05-28 16:06:55.292733', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (1378, 30, 82, 124, 1699, '24 HR', true, '25% OFF', 'Standard package offered by branch 82', true, '2026-05-28 16:06:55.294597', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (1379, 31, 83, 124, 1399, '48 HR', true, '25% OFF', 'Standard package offered by branch 83', true, '2026-05-28 16:06:55.29662', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (1380, 1, 1, 125, 1499, '48 HR', true, '25% OFF', 'Standard package offered by branch 1', true, '2026-05-28 16:06:55.298089', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (1381, 1, 2, 125, 1699, '24 HR', true, '25% OFF', 'Standard package offered by branch 2', true, '2026-05-28 16:06:55.299258', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (1382, 1, 3, 125, 1399, '48 HR', true, '25% OFF', 'Standard package offered by branch 3', true, '2026-05-28 16:06:55.300474', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (1383, 1, 4, 125, 1599, '24 HR', true, '25% OFF', 'Standard package offered by branch 4', true, '2026-05-28 16:06:55.301701', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (1384, 2, 5, 125, 1299, '48 HR', true, '25% OFF', 'Standard package offered by branch 5', true, '2026-05-28 16:06:55.303085', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (1385, 3, 6, 125, 1499, '24 HR', true, '25% OFF', 'Standard package offered by branch 6', true, '2026-05-28 16:06:55.304554', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (1386, 3, 7, 125, 1699, '48 HR', true, '25% OFF', 'Standard package offered by branch 7', true, '2026-05-28 16:06:55.305932', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (1387, 3, 8, 125, 1399, '24 HR', true, '25% OFF', 'Standard package offered by branch 8', true, '2026-05-28 16:06:55.308235', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (1388, 3, 9, 125, 1599, '48 HR', true, '25% OFF', 'Standard package offered by branch 9', true, '2026-05-28 16:06:55.310775', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (1389, 4, 10, 125, 1299, '24 HR', true, '25% OFF', 'Standard package offered by branch 10', true, '2026-05-28 16:06:55.312804', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (1390, 4, 11, 125, 1499, '48 HR', true, '25% OFF', 'Standard package offered by branch 11', true, '2026-05-28 16:06:55.314458', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (1391, 4, 12, 125, 1699, '24 HR', true, '25% OFF', 'Standard package offered by branch 12', true, '2026-05-28 16:06:55.316197', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (1392, 4, 13, 125, 1399, '48 HR', true, '25% OFF', 'Standard package offered by branch 13', true, '2026-05-28 16:06:55.31771', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (1393, 4, 14, 125, 1599, '24 HR', true, '25% OFF', 'Standard package offered by branch 14', true, '2026-05-28 16:06:55.319121', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (1394, 5, 15, 125, 1299, '48 HR', true, '25% OFF', 'Standard package offered by branch 15', true, '2026-05-28 16:06:55.32039', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (1395, 6, 16, 125, 1499, '24 HR', true, '25% OFF', 'Standard package offered by branch 16', true, '2026-05-28 16:06:55.321935', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (1396, 6, 17, 125, 1699, '48 HR', true, '25% OFF', 'Standard package offered by branch 17', true, '2026-05-28 16:06:55.323771', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (1397, 6, 18, 125, 1399, '24 HR', true, '25% OFF', 'Standard package offered by branch 18', true, '2026-05-28 16:06:55.325432', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (1398, 6, 19, 125, 1599, '48 HR', true, '25% OFF', 'Standard package offered by branch 19', true, '2026-05-28 16:06:55.326935', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (1399, 7, 20, 125, 1299, '24 HR', true, '25% OFF', 'Standard package offered by branch 20', true, '2026-05-28 16:06:55.328629', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (1401, 8, 22, 125, 1699, '24 HR', true, '25% OFF', 'Standard package offered by branch 22', true, '2026-05-28 16:06:55.332435', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (1402, 8, 23, 125, 1399, '48 HR', true, '25% OFF', 'Standard package offered by branch 23', true, '2026-05-28 16:06:55.333606', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (1403, 9, 24, 125, 1599, '24 HR', true, '25% OFF', 'Standard package offered by branch 24', true, '2026-05-28 16:06:55.334891', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (1404, 10, 25, 125, 1299, '48 HR', true, '25% OFF', 'Standard package offered by branch 25', true, '2026-05-28 16:06:55.336249', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (1405, 10, 26, 125, 1499, '24 HR', true, '25% OFF', 'Standard package offered by branch 26', true, '2026-05-28 16:06:55.337249', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (1342, 17, 46, 124, 1499, '24 HR', true, '25% OFF', 'Standard package offered by branch 46', true, '2026-05-28 16:06:55.23195', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (1343, 18, 47, 124, 1699, '48 HR', true, '25% OFF', 'Standard package offered by branch 47', true, '2026-05-28 16:06:55.233418', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (1344, 18, 48, 124, 1399, '24 HR', true, '25% OFF', 'Standard package offered by branch 48', true, '2026-05-28 16:06:55.23481', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (1345, 18, 49, 124, 1599, '48 HR', true, '25% OFF', 'Standard package offered by branch 49', true, '2026-05-28 16:06:55.236383', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (1468, 3, 6, 126, 2499, '24 HR', true, '16% OFF', 'Standard package offered by branch 6', true, '2026-05-28 16:06:55.46604', 16, 2975);
INSERT INTO public.lab_package_branches VALUES (1469, 3, 7, 126, 2699, '48 HR', true, '16% OFF', 'Standard package offered by branch 7', true, '2026-05-28 16:06:55.467527', 16, 3214);
INSERT INTO public.lab_package_branches VALUES (1470, 3, 8, 126, 2399, '24 HR', true, '16% OFF', 'Standard package offered by branch 8', true, '2026-05-28 16:06:55.468915', 16, 2856);
INSERT INTO public.lab_package_branches VALUES (1406, 10, 27, 125, 1699, '48 HR', true, '25% OFF', 'Standard package offered by branch 27', true, '2026-05-28 16:06:55.338399', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (1407, 11, 28, 125, 1399, '24 HR', true, '25% OFF', 'Standard package offered by branch 28', true, '2026-05-28 16:06:55.339895', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (1408, 12, 29, 125, 1599, '48 HR', true, '25% OFF', 'Standard package offered by branch 29', true, '2026-05-28 16:06:55.341495', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (1409, 12, 30, 125, 1299, '24 HR', true, '25% OFF', 'Standard package offered by branch 30', true, '2026-05-28 16:06:55.343051', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (1410, 12, 31, 125, 1499, '48 HR', true, '25% OFF', 'Standard package offered by branch 31', true, '2026-05-28 16:06:55.344804', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (1411, 13, 32, 125, 1699, '24 HR', true, '25% OFF', 'Standard package offered by branch 32', true, '2026-05-28 16:06:55.346449', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (1412, 14, 33, 125, 1399, '48 HR', true, '25% OFF', 'Standard package offered by branch 33', true, '2026-05-28 16:06:55.347867', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (1413, 14, 34, 125, 1599, '24 HR', true, '25% OFF', 'Standard package offered by branch 34', true, '2026-05-28 16:06:55.349125', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (1414, 14, 35, 125, 1299, '48 HR', true, '25% OFF', 'Standard package offered by branch 35', true, '2026-05-28 16:06:55.350337', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (1415, 14, 36, 125, 1499, '24 HR', true, '25% OFF', 'Standard package offered by branch 36', true, '2026-05-28 16:06:55.351641', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (1416, 15, 37, 125, 1699, '48 HR', true, '25% OFF', 'Standard package offered by branch 37', true, '2026-05-28 16:06:55.353032', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (1417, 16, 38, 125, 1399, '24 HR', true, '25% OFF', 'Standard package offered by branch 38', true, '2026-05-28 16:06:55.354361', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (1418, 16, 39, 125, 1599, '48 HR', true, '25% OFF', 'Standard package offered by branch 39', true, '2026-05-28 16:06:55.355862', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (1419, 16, 40, 125, 1299, '24 HR', true, '25% OFF', 'Standard package offered by branch 40', true, '2026-05-28 16:06:55.35765', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (1420, 16, 41, 125, 1499, '48 HR', true, '25% OFF', 'Standard package offered by branch 41', true, '2026-05-28 16:06:55.358958', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (1421, 17, 42, 125, 1699, '24 HR', true, '25% OFF', 'Standard package offered by branch 42', true, '2026-05-28 16:06:55.360409', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (1422, 17, 43, 125, 1399, '48 HR', true, '25% OFF', 'Standard package offered by branch 43', true, '2026-05-28 16:06:55.361785', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (1423, 17, 44, 125, 1599, '24 HR', true, '25% OFF', 'Standard package offered by branch 44', true, '2026-05-28 16:06:55.363134', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (1424, 17, 45, 125, 1299, '48 HR', true, '25% OFF', 'Standard package offered by branch 45', true, '2026-05-28 16:06:55.3644', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (1425, 17, 46, 125, 1499, '24 HR', true, '25% OFF', 'Standard package offered by branch 46', true, '2026-05-28 16:06:55.365964', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (1427, 18, 48, 125, 1399, '24 HR', true, '25% OFF', 'Standard package offered by branch 48', true, '2026-05-28 16:06:55.369279', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (1428, 18, 49, 125, 1599, '48 HR', true, '25% OFF', 'Standard package offered by branch 49', true, '2026-05-28 16:06:55.370715', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (1429, 18, 50, 125, 1299, '24 HR', true, '25% OFF', 'Standard package offered by branch 50', true, '2026-05-28 16:06:55.372202', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (1430, 19, 51, 125, 1499, '48 HR', true, '25% OFF', 'Standard package offered by branch 51', true, '2026-05-28 16:06:55.37378', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (1431, 20, 52, 125, 1699, '24 HR', true, '25% OFF', 'Standard package offered by branch 52', true, '2026-05-28 16:06:55.375026', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (1432, 20, 53, 125, 1399, '48 HR', true, '25% OFF', 'Standard package offered by branch 53', true, '2026-05-28 16:06:55.376658', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (1433, 20, 54, 125, 1599, '24 HR', true, '25% OFF', 'Standard package offered by branch 54', true, '2026-05-28 16:06:55.378099', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (1434, 20, 55, 125, 1299, '48 HR', true, '25% OFF', 'Standard package offered by branch 55', true, '2026-05-28 16:06:55.380005', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (1435, 21, 56, 125, 1499, '24 HR', true, '25% OFF', 'Standard package offered by branch 56', true, '2026-05-28 16:06:55.381364', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (1436, 21, 57, 125, 1699, '48 HR', true, '25% OFF', 'Standard package offered by branch 57', true, '2026-05-28 16:06:55.382989', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (1437, 22, 58, 125, 1399, '24 HR', true, '25% OFF', 'Standard package offered by branch 58', true, '2026-05-28 16:06:55.384432', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (1438, 22, 59, 125, 1599, '48 HR', true, '25% OFF', 'Standard package offered by branch 59', true, '2026-05-28 16:06:55.386404', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (1439, 22, 60, 125, 1299, '24 HR', true, '25% OFF', 'Standard package offered by branch 60', true, '2026-05-28 16:06:55.38801', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (1440, 23, 61, 125, 1499, '48 HR', true, '25% OFF', 'Standard package offered by branch 61', true, '2026-05-28 16:06:55.389638', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (1441, 24, 62, 125, 1699, '24 HR', true, '25% OFF', 'Standard package offered by branch 62', true, '2026-05-28 16:06:55.391779', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (1442, 24, 63, 125, 1399, '48 HR', true, '25% OFF', 'Standard package offered by branch 63', true, '2026-05-28 16:06:55.393493', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (1443, 24, 64, 125, 1599, '24 HR', true, '25% OFF', 'Standard package offered by branch 64', true, '2026-05-28 16:06:55.39501', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (1444, 25, 65, 125, 1299, '48 HR', true, '25% OFF', 'Standard package offered by branch 65', true, '2026-05-28 16:06:55.396628', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (1445, 25, 66, 125, 1499, '24 HR', true, '25% OFF', 'Standard package offered by branch 66', true, '2026-05-28 16:06:55.398298', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (1446, 25, 67, 125, 1699, '48 HR', true, '25% OFF', 'Standard package offered by branch 67', true, '2026-05-28 16:06:55.400196', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (1447, 26, 68, 125, 1399, '24 HR', true, '25% OFF', 'Standard package offered by branch 68', true, '2026-05-28 16:06:55.402428', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (1448, 26, 69, 125, 1599, '48 HR', true, '25% OFF', 'Standard package offered by branch 69', true, '2026-05-28 16:06:55.404254', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (1449, 26, 70, 125, 1299, '24 HR', true, '25% OFF', 'Standard package offered by branch 70', true, '2026-05-28 16:06:55.415876', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (1450, 27, 71, 125, 1499, '48 HR', true, '25% OFF', 'Standard package offered by branch 71', true, '2026-05-28 16:06:55.423497', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (1451, 27, 72, 125, 1699, '24 HR', true, '25% OFF', 'Standard package offered by branch 72', true, '2026-05-28 16:06:55.425914', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (1452, 27, 73, 125, 1399, '48 HR', true, '25% OFF', 'Standard package offered by branch 73', true, '2026-05-28 16:06:55.428718', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (1453, 28, 74, 125, 1599, '24 HR', true, '25% OFF', 'Standard package offered by branch 74', true, '2026-05-28 16:06:55.430583', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (1454, 29, 75, 125, 1299, '48 HR', true, '25% OFF', 'Standard package offered by branch 75', true, '2026-05-28 16:06:55.432209', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (1455, 29, 76, 125, 1499, '24 HR', true, '25% OFF', 'Standard package offered by branch 76', true, '2026-05-28 16:06:55.433745', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (1456, 29, 77, 125, 1699, '48 HR', true, '25% OFF', 'Standard package offered by branch 77', true, '2026-05-28 16:06:55.442347', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (1458, 30, 79, 125, 1599, '48 HR', true, '25% OFF', 'Standard package offered by branch 79', true, '2026-05-28 16:06:55.449194', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (1459, 30, 80, 125, 1299, '24 HR', true, '25% OFF', 'Standard package offered by branch 80', true, '2026-05-28 16:06:55.451042', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (1460, 30, 81, 125, 1499, '48 HR', true, '25% OFF', 'Standard package offered by branch 81', true, '2026-05-28 16:06:55.452628', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (1461, 30, 82, 125, 1699, '24 HR', true, '25% OFF', 'Standard package offered by branch 82', true, '2026-05-28 16:06:55.454139', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (1462, 31, 83, 125, 1399, '48 HR', true, '25% OFF', 'Standard package offered by branch 83', true, '2026-05-28 16:06:55.455589', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (1464, 1, 2, 126, 2699, '24 HR', true, '16% OFF', 'Standard package offered by branch 2', true, '2026-05-28 16:06:55.458629', 16, 3214);
INSERT INTO public.lab_package_branches VALUES (1465, 1, 3, 126, 2399, '48 HR', true, '16% OFF', 'Standard package offered by branch 3', true, '2026-05-28 16:06:55.46042', 16, 2856);
INSERT INTO public.lab_package_branches VALUES (1466, 1, 4, 126, 2599, '24 HR', true, '16% OFF', 'Standard package offered by branch 4', true, '2026-05-28 16:06:55.463019', 16, 3095);
INSERT INTO public.lab_package_branches VALUES (1467, 2, 5, 126, 2299, '48 HR', true, '16% OFF', 'Standard package offered by branch 5', true, '2026-05-28 16:06:55.464516', 16, 2737);
INSERT INTO public.lab_package_branches VALUES (1476, 4, 14, 126, 2599, '24 HR', true, '16% OFF', 'Standard package offered by branch 14', true, '2026-05-28 16:06:55.479915', 16, 3095);
INSERT INTO public.lab_package_branches VALUES (1477, 5, 15, 126, 2299, '48 HR', true, '16% OFF', 'Standard package offered by branch 15', true, '2026-05-28 16:06:55.482146', 16, 2737);
INSERT INTO public.lab_package_branches VALUES (1478, 6, 16, 126, 2499, '24 HR', true, '16% OFF', 'Standard package offered by branch 16', true, '2026-05-28 16:06:55.483762', 16, 2975);
INSERT INTO public.lab_package_branches VALUES (1479, 6, 17, 126, 2699, '48 HR', true, '16% OFF', 'Standard package offered by branch 17', true, '2026-05-28 16:06:55.485345', 16, 3214);
INSERT INTO public.lab_package_branches VALUES (1480, 6, 18, 126, 2399, '24 HR', true, '16% OFF', 'Standard package offered by branch 18', true, '2026-05-28 16:06:55.487025', 16, 2856);
INSERT INTO public.lab_package_branches VALUES (1481, 6, 19, 126, 2599, '48 HR', true, '16% OFF', 'Standard package offered by branch 19', true, '2026-05-28 16:06:55.48847', 16, 3095);
INSERT INTO public.lab_package_branches VALUES (1482, 7, 20, 126, 2299, '24 HR', true, '16% OFF', 'Standard package offered by branch 20', true, '2026-05-28 16:06:55.489782', 16, 2737);
INSERT INTO public.lab_package_branches VALUES (1483, 8, 21, 126, 2499, '48 HR', true, '16% OFF', 'Standard package offered by branch 21', true, '2026-05-28 16:06:55.491306', 16, 2975);
INSERT INTO public.lab_package_branches VALUES (1484, 8, 22, 126, 2699, '24 HR', true, '16% OFF', 'Standard package offered by branch 22', true, '2026-05-28 16:06:55.4927', 16, 3214);
INSERT INTO public.lab_package_branches VALUES (1485, 8, 23, 126, 2399, '48 HR', true, '16% OFF', 'Standard package offered by branch 23', true, '2026-05-28 16:06:55.494672', 16, 2856);
INSERT INTO public.lab_package_branches VALUES (1486, 9, 24, 126, 2599, '24 HR', true, '16% OFF', 'Standard package offered by branch 24', true, '2026-05-28 16:06:55.496529', 16, 3095);
INSERT INTO public.lab_package_branches VALUES (1487, 10, 25, 126, 2299, '48 HR', true, '16% OFF', 'Standard package offered by branch 25', true, '2026-05-28 16:06:55.505045', 16, 2737);
INSERT INTO public.lab_package_branches VALUES (1488, 10, 26, 126, 2499, '24 HR', true, '16% OFF', 'Standard package offered by branch 26', true, '2026-05-28 16:06:55.508192', 16, 2975);
INSERT INTO public.lab_package_branches VALUES (1489, 10, 27, 126, 2699, '48 HR', true, '16% OFF', 'Standard package offered by branch 27', true, '2026-05-28 16:06:55.51081', 16, 3214);
INSERT INTO public.lab_package_branches VALUES (1490, 11, 28, 126, 2399, '24 HR', true, '16% OFF', 'Standard package offered by branch 28', true, '2026-05-28 16:06:55.513748', 16, 2856);
INSERT INTO public.lab_package_branches VALUES (1491, 12, 29, 126, 2599, '48 HR', true, '16% OFF', 'Standard package offered by branch 29', true, '2026-05-28 16:06:55.516089', 16, 3095);
INSERT INTO public.lab_package_branches VALUES (1492, 12, 30, 126, 2299, '24 HR', true, '16% OFF', 'Standard package offered by branch 30', true, '2026-05-28 16:06:55.518284', 16, 2737);
INSERT INTO public.lab_package_branches VALUES (1493, 12, 31, 126, 2499, '48 HR', true, '16% OFF', 'Standard package offered by branch 31', true, '2026-05-28 16:06:55.519964', 16, 2975);
INSERT INTO public.lab_package_branches VALUES (1494, 13, 32, 126, 2699, '24 HR', true, '16% OFF', 'Standard package offered by branch 32', true, '2026-05-28 16:06:55.521713', 16, 3214);
INSERT INTO public.lab_package_branches VALUES (1495, 14, 33, 126, 2399, '48 HR', true, '16% OFF', 'Standard package offered by branch 33', true, '2026-05-28 16:06:55.523602', 16, 2856);
INSERT INTO public.lab_package_branches VALUES (1496, 14, 34, 126, 2599, '24 HR', true, '16% OFF', 'Standard package offered by branch 34', true, '2026-05-28 16:06:55.525258', 16, 3095);
INSERT INTO public.lab_package_branches VALUES (1497, 14, 35, 126, 2299, '48 HR', true, '16% OFF', 'Standard package offered by branch 35', true, '2026-05-28 16:06:55.526938', 16, 2737);
INSERT INTO public.lab_package_branches VALUES (1498, 14, 36, 126, 2499, '24 HR', true, '16% OFF', 'Standard package offered by branch 36', true, '2026-05-28 16:06:55.528693', 16, 2975);
INSERT INTO public.lab_package_branches VALUES (1500, 16, 38, 126, 2399, '24 HR', true, '16% OFF', 'Standard package offered by branch 38', true, '2026-05-28 16:06:55.531666', 16, 2856);
INSERT INTO public.lab_package_branches VALUES (1501, 16, 39, 126, 2599, '48 HR', true, '16% OFF', 'Standard package offered by branch 39', true, '2026-05-28 16:06:55.532994', 16, 3095);
INSERT INTO public.lab_package_branches VALUES (1502, 16, 40, 126, 2299, '24 HR', true, '16% OFF', 'Standard package offered by branch 40', true, '2026-05-28 16:06:55.534378', 16, 2737);
INSERT INTO public.lab_package_branches VALUES (1503, 16, 41, 126, 2499, '48 HR', true, '16% OFF', 'Standard package offered by branch 41', true, '2026-05-28 16:06:55.535953', 16, 2975);
INSERT INTO public.lab_package_branches VALUES (1504, 17, 42, 126, 2699, '24 HR', true, '16% OFF', 'Standard package offered by branch 42', true, '2026-05-28 16:06:55.537379', 16, 3214);
INSERT INTO public.lab_package_branches VALUES (1505, 17, 43, 126, 2399, '48 HR', true, '16% OFF', 'Standard package offered by branch 43', true, '2026-05-28 16:06:55.53867', 16, 2856);
INSERT INTO public.lab_package_branches VALUES (1506, 17, 44, 126, 2599, '24 HR', true, '16% OFF', 'Standard package offered by branch 44', true, '2026-05-28 16:06:55.54021', 16, 3095);
INSERT INTO public.lab_package_branches VALUES (1507, 17, 45, 126, 2299, '48 HR', true, '16% OFF', 'Standard package offered by branch 45', true, '2026-05-28 16:06:55.541955', 16, 2737);
INSERT INTO public.lab_package_branches VALUES (1508, 17, 46, 126, 2499, '24 HR', true, '16% OFF', 'Standard package offered by branch 46', true, '2026-05-28 16:06:55.543858', 16, 2975);
INSERT INTO public.lab_package_branches VALUES (1509, 18, 47, 126, 2699, '48 HR', true, '16% OFF', 'Standard package offered by branch 47', true, '2026-05-28 16:06:55.545224', 16, 3214);
INSERT INTO public.lab_package_branches VALUES (1510, 18, 48, 126, 2399, '24 HR', true, '16% OFF', 'Standard package offered by branch 48', true, '2026-05-28 16:06:55.546689', 16, 2856);
INSERT INTO public.lab_package_branches VALUES (1511, 18, 49, 126, 2599, '48 HR', true, '16% OFF', 'Standard package offered by branch 49', true, '2026-05-28 16:06:55.548437', 16, 3095);
INSERT INTO public.lab_package_branches VALUES (1512, 18, 50, 126, 2299, '24 HR', true, '16% OFF', 'Standard package offered by branch 50', true, '2026-05-28 16:06:55.55002', 16, 2737);
INSERT INTO public.lab_package_branches VALUES (1513, 19, 51, 126, 2499, '48 HR', true, '16% OFF', 'Standard package offered by branch 51', true, '2026-05-28 16:06:55.551157', 16, 2975);
INSERT INTO public.lab_package_branches VALUES (1514, 20, 52, 126, 2699, '24 HR', true, '16% OFF', 'Standard package offered by branch 52', true, '2026-05-28 16:06:55.552617', 16, 3214);
INSERT INTO public.lab_package_branches VALUES (1515, 20, 53, 126, 2399, '48 HR', true, '16% OFF', 'Standard package offered by branch 53', true, '2026-05-28 16:06:55.553837', 16, 2856);
INSERT INTO public.lab_package_branches VALUES (1516, 20, 54, 126, 2599, '24 HR', true, '16% OFF', 'Standard package offered by branch 54', true, '2026-05-28 16:06:55.555033', 16, 3095);
INSERT INTO public.lab_package_branches VALUES (1517, 20, 55, 126, 2299, '48 HR', true, '16% OFF', 'Standard package offered by branch 55', true, '2026-05-28 16:06:55.556256', 16, 2737);
INSERT INTO public.lab_package_branches VALUES (1518, 21, 56, 126, 2499, '24 HR', true, '16% OFF', 'Standard package offered by branch 56', true, '2026-05-28 16:06:55.557713', 16, 2975);
INSERT INTO public.lab_package_branches VALUES (1519, 21, 57, 126, 2699, '48 HR', true, '16% OFF', 'Standard package offered by branch 57', true, '2026-05-28 16:06:55.558918', 16, 3214);
INSERT INTO public.lab_package_branches VALUES (1520, 22, 58, 126, 2399, '24 HR', true, '16% OFF', 'Standard package offered by branch 58', true, '2026-05-28 16:06:55.560398', 16, 2856);
INSERT INTO public.lab_package_branches VALUES (1521, 22, 59, 126, 2599, '48 HR', true, '16% OFF', 'Standard package offered by branch 59', true, '2026-05-28 16:06:55.561828', 16, 3095);
INSERT INTO public.lab_package_branches VALUES (1522, 22, 60, 126, 2299, '24 HR', true, '16% OFF', 'Standard package offered by branch 60', true, '2026-05-28 16:06:55.563322', 16, 2737);
INSERT INTO public.lab_package_branches VALUES (1523, 23, 61, 126, 2499, '48 HR', true, '16% OFF', 'Standard package offered by branch 61', true, '2026-05-28 16:06:55.564849', 16, 2975);
INSERT INTO public.lab_package_branches VALUES (1524, 24, 62, 126, 2699, '24 HR', true, '16% OFF', 'Standard package offered by branch 62', true, '2026-05-28 16:06:55.566261', 16, 3214);
INSERT INTO public.lab_package_branches VALUES (1525, 24, 63, 126, 2399, '48 HR', true, '16% OFF', 'Standard package offered by branch 63', true, '2026-05-28 16:06:55.567867', 16, 2856);
INSERT INTO public.lab_package_branches VALUES (1526, 24, 64, 126, 2599, '24 HR', true, '16% OFF', 'Standard package offered by branch 64', true, '2026-05-28 16:06:55.569305', 16, 3095);
INSERT INTO public.lab_package_branches VALUES (1527, 25, 65, 126, 2299, '48 HR', true, '16% OFF', 'Standard package offered by branch 65', true, '2026-05-28 16:06:55.570752', 16, 2737);
INSERT INTO public.lab_package_branches VALUES (1528, 25, 66, 126, 2499, '24 HR', true, '16% OFF', 'Standard package offered by branch 66', true, '2026-05-28 16:06:55.572097', 16, 2975);
INSERT INTO public.lab_package_branches VALUES (1529, 25, 67, 126, 2699, '48 HR', true, '16% OFF', 'Standard package offered by branch 67', true, '2026-05-28 16:06:55.573242', 16, 3214);
INSERT INTO public.lab_package_branches VALUES (1531, 26, 69, 126, 2599, '48 HR', true, '16% OFF', 'Standard package offered by branch 69', true, '2026-05-28 16:06:55.576655', 16, 3095);
INSERT INTO public.lab_package_branches VALUES (1532, 26, 70, 126, 2299, '24 HR', true, '16% OFF', 'Standard package offered by branch 70', true, '2026-05-28 16:06:55.578244', 16, 2737);
INSERT INTO public.lab_package_branches VALUES (1533, 27, 71, 126, 2499, '48 HR', true, '16% OFF', 'Standard package offered by branch 71', true, '2026-05-28 16:06:55.579722', 16, 2975);
INSERT INTO public.lab_package_branches VALUES (1534, 27, 72, 126, 2699, '24 HR', true, '16% OFF', 'Standard package offered by branch 72', true, '2026-05-28 16:06:55.581236', 16, 3214);
INSERT INTO public.lab_package_branches VALUES (1535, 27, 73, 126, 2399, '48 HR', true, '16% OFF', 'Standard package offered by branch 73', true, '2026-05-28 16:06:55.582573', 16, 2856);
INSERT INTO public.lab_package_branches VALUES (1472, 4, 10, 126, 2299, '24 HR', true, '16% OFF', 'Standard package offered by branch 10', true, '2026-05-28 16:06:55.472275', 16, 2737);
INSERT INTO public.lab_package_branches VALUES (1473, 4, 11, 126, 2499, '48 HR', true, '16% OFF', 'Standard package offered by branch 11', true, '2026-05-28 16:06:55.473818', 16, 2975);
INSERT INTO public.lab_package_branches VALUES (1474, 4, 12, 126, 2699, '24 HR', true, '16% OFF', 'Standard package offered by branch 12', true, '2026-05-28 16:06:55.475501', 16, 3214);
INSERT INTO public.lab_package_branches VALUES (1475, 4, 13, 126, 2399, '48 HR', true, '16% OFF', 'Standard package offered by branch 13', true, '2026-05-28 16:06:55.477779', 16, 2856);
INSERT INTO public.lab_package_branches VALUES (1541, 30, 79, 126, 2599, '48 HR', true, '16% OFF', 'Standard package offered by branch 79', true, '2026-05-28 16:06:55.591181', 16, 3095);
INSERT INTO public.lab_package_branches VALUES (1542, 30, 80, 126, 2299, '24 HR', true, '16% OFF', 'Standard package offered by branch 80', true, '2026-05-28 16:06:55.593232', 16, 2737);
INSERT INTO public.lab_package_branches VALUES (1543, 30, 81, 126, 2499, '48 HR', true, '16% OFF', 'Standard package offered by branch 81', true, '2026-05-28 16:06:55.594804', 16, 2975);
INSERT INTO public.lab_package_branches VALUES (1544, 30, 82, 126, 2699, '24 HR', true, '16% OFF', 'Standard package offered by branch 82', true, '2026-05-28 16:06:55.596067', 16, 3214);
INSERT INTO public.lab_package_branches VALUES (1545, 31, 83, 126, 2399, '48 HR', true, '16% OFF', 'Standard package offered by branch 83', true, '2026-05-28 16:06:55.597182', 16, 2856);
INSERT INTO public.lab_package_branches VALUES (1546, 1, 1, 127, 2499, '48 HR', true, '16% OFF', 'Standard package offered by branch 1', true, '2026-05-28 16:06:55.598353', 16, 2975);
INSERT INTO public.lab_package_branches VALUES (1547, 1, 2, 127, 2699, '24 HR', true, '16% OFF', 'Standard package offered by branch 2', true, '2026-05-28 16:06:55.599619', 16, 3214);
INSERT INTO public.lab_package_branches VALUES (1548, 1, 3, 127, 2399, '48 HR', true, '16% OFF', 'Standard package offered by branch 3', true, '2026-05-28 16:06:55.601073', 16, 2856);
INSERT INTO public.lab_package_branches VALUES (1549, 1, 4, 127, 2599, '24 HR', true, '16% OFF', 'Standard package offered by branch 4', true, '2026-05-28 16:06:55.602303', 16, 3095);
INSERT INTO public.lab_package_branches VALUES (1550, 2, 5, 127, 2299, '48 HR', true, '16% OFF', 'Standard package offered by branch 5', true, '2026-05-28 16:06:55.603583', 16, 2737);
INSERT INTO public.lab_package_branches VALUES (1551, 3, 6, 127, 2499, '24 HR', true, '16% OFF', 'Standard package offered by branch 6', true, '2026-05-28 16:06:55.605021', 16, 2975);
INSERT INTO public.lab_package_branches VALUES (1552, 3, 7, 127, 2699, '48 HR', true, '16% OFF', 'Standard package offered by branch 7', true, '2026-05-28 16:06:55.606356', 16, 3214);
INSERT INTO public.lab_package_branches VALUES (1553, 3, 8, 127, 2399, '24 HR', true, '16% OFF', 'Standard package offered by branch 8', true, '2026-05-28 16:06:55.608216', 16, 2856);
INSERT INTO public.lab_package_branches VALUES (1554, 3, 9, 127, 2599, '48 HR', true, '16% OFF', 'Standard package offered by branch 9', true, '2026-05-28 16:06:55.609815', 16, 3095);
INSERT INTO public.lab_package_branches VALUES (1555, 4, 10, 127, 2299, '24 HR', true, '16% OFF', 'Standard package offered by branch 10', true, '2026-05-28 16:06:55.61133', 16, 2737);
INSERT INTO public.lab_package_branches VALUES (1556, 4, 11, 127, 2499, '48 HR', true, '16% OFF', 'Standard package offered by branch 11', true, '2026-05-28 16:06:55.613082', 16, 2975);
INSERT INTO public.lab_package_branches VALUES (1557, 4, 12, 127, 2699, '24 HR', true, '16% OFF', 'Standard package offered by branch 12', true, '2026-05-28 16:06:55.615226', 16, 3214);
INSERT INTO public.lab_package_branches VALUES (1558, 4, 13, 127, 2399, '48 HR', true, '16% OFF', 'Standard package offered by branch 13', true, '2026-05-28 16:06:55.618879', 16, 2856);
INSERT INTO public.lab_package_branches VALUES (1559, 4, 14, 127, 2599, '24 HR', true, '16% OFF', 'Standard package offered by branch 14', true, '2026-05-28 16:06:55.629629', 16, 3095);
INSERT INTO public.lab_package_branches VALUES (1560, 5, 15, 127, 2299, '48 HR', true, '16% OFF', 'Standard package offered by branch 15', true, '2026-05-28 16:06:55.63285', 16, 2737);
INSERT INTO public.lab_package_branches VALUES (1561, 6, 16, 127, 2499, '24 HR', true, '16% OFF', 'Standard package offered by branch 16', true, '2026-05-28 16:06:55.635071', 16, 2975);
INSERT INTO public.lab_package_branches VALUES (1562, 6, 17, 127, 2699, '48 HR', true, '16% OFF', 'Standard package offered by branch 17', true, '2026-05-28 16:06:55.636908', 16, 3214);
INSERT INTO public.lab_package_branches VALUES (1563, 6, 18, 127, 2399, '24 HR', true, '16% OFF', 'Standard package offered by branch 18', true, '2026-05-28 16:06:55.642786', 16, 2856);
INSERT INTO public.lab_package_branches VALUES (1565, 7, 20, 127, 2299, '24 HR', true, '16% OFF', 'Standard package offered by branch 20', true, '2026-05-28 16:06:55.646513', 16, 2737);
INSERT INTO public.lab_package_branches VALUES (1566, 8, 21, 127, 2499, '48 HR', true, '16% OFF', 'Standard package offered by branch 21', true, '2026-05-28 16:06:55.647853', 16, 2975);
INSERT INTO public.lab_package_branches VALUES (1567, 8, 22, 127, 2699, '24 HR', true, '16% OFF', 'Standard package offered by branch 22', true, '2026-05-28 16:06:55.649014', 16, 3214);
INSERT INTO public.lab_package_branches VALUES (1568, 8, 23, 127, 2399, '48 HR', true, '16% OFF', 'Standard package offered by branch 23', true, '2026-05-28 16:06:55.650239', 16, 2856);
INSERT INTO public.lab_package_branches VALUES (1569, 9, 24, 127, 2599, '24 HR', true, '16% OFF', 'Standard package offered by branch 24', true, '2026-05-28 16:06:55.651442', 16, 3095);
INSERT INTO public.lab_package_branches VALUES (1570, 10, 25, 127, 2299, '48 HR', true, '16% OFF', 'Standard package offered by branch 25', true, '2026-05-28 16:06:55.652505', 16, 2737);
INSERT INTO public.lab_package_branches VALUES (1571, 10, 26, 127, 2499, '24 HR', true, '16% OFF', 'Standard package offered by branch 26', true, '2026-05-28 16:06:55.654022', 16, 2975);
INSERT INTO public.lab_package_branches VALUES (1572, 10, 27, 127, 2699, '48 HR', true, '16% OFF', 'Standard package offered by branch 27', true, '2026-05-28 16:06:55.655414', 16, 3214);
INSERT INTO public.lab_package_branches VALUES (1573, 11, 28, 127, 2399, '24 HR', true, '16% OFF', 'Standard package offered by branch 28', true, '2026-05-28 16:06:55.656793', 16, 2856);
INSERT INTO public.lab_package_branches VALUES (1574, 12, 29, 127, 2599, '48 HR', true, '16% OFF', 'Standard package offered by branch 29', true, '2026-05-28 16:06:55.658324', 16, 3095);
INSERT INTO public.lab_package_branches VALUES (1575, 12, 30, 127, 2299, '24 HR', true, '16% OFF', 'Standard package offered by branch 30', true, '2026-05-28 16:06:55.65973', 16, 2737);
INSERT INTO public.lab_package_branches VALUES (1576, 12, 31, 127, 2499, '48 HR', true, '16% OFF', 'Standard package offered by branch 31', true, '2026-05-28 16:06:55.660894', 16, 2975);
INSERT INTO public.lab_package_branches VALUES (1577, 13, 32, 127, 2699, '24 HR', true, '16% OFF', 'Standard package offered by branch 32', true, '2026-05-28 16:06:55.661899', 16, 3214);
INSERT INTO public.lab_package_branches VALUES (1578, 14, 33, 127, 2399, '48 HR', true, '16% OFF', 'Standard package offered by branch 33', true, '2026-05-28 16:06:55.663083', 16, 2856);
INSERT INTO public.lab_package_branches VALUES (1579, 14, 34, 127, 2599, '24 HR', true, '16% OFF', 'Standard package offered by branch 34', true, '2026-05-28 16:06:55.664281', 16, 3095);
INSERT INTO public.lab_package_branches VALUES (1580, 14, 35, 127, 2299, '48 HR', true, '16% OFF', 'Standard package offered by branch 35', true, '2026-05-28 16:06:55.665254', 16, 2737);
INSERT INTO public.lab_package_branches VALUES (1581, 14, 36, 127, 2499, '24 HR', true, '16% OFF', 'Standard package offered by branch 36', true, '2026-05-28 16:06:55.66631', 16, 2975);
INSERT INTO public.lab_package_branches VALUES (1582, 15, 37, 127, 2699, '48 HR', true, '16% OFF', 'Standard package offered by branch 37', true, '2026-05-28 16:06:55.66718', 16, 3214);
INSERT INTO public.lab_package_branches VALUES (1583, 16, 38, 127, 2399, '24 HR', true, '16% OFF', 'Standard package offered by branch 38', true, '2026-05-28 16:06:55.668044', 16, 2856);
INSERT INTO public.lab_package_branches VALUES (1584, 16, 39, 127, 2599, '48 HR', true, '16% OFF', 'Standard package offered by branch 39', true, '2026-05-28 16:06:55.668999', 16, 3095);
INSERT INTO public.lab_package_branches VALUES (1585, 16, 40, 127, 2299, '24 HR', true, '16% OFF', 'Standard package offered by branch 40', true, '2026-05-28 16:06:55.670261', 16, 2737);
INSERT INTO public.lab_package_branches VALUES (1586, 16, 41, 127, 2499, '48 HR', true, '16% OFF', 'Standard package offered by branch 41', true, '2026-05-28 16:06:55.671491', 16, 2975);
INSERT INTO public.lab_package_branches VALUES (1587, 17, 42, 127, 2699, '24 HR', true, '16% OFF', 'Standard package offered by branch 42', true, '2026-05-28 16:06:55.673304', 16, 3214);
INSERT INTO public.lab_package_branches VALUES (1588, 17, 43, 127, 2399, '48 HR', true, '16% OFF', 'Standard package offered by branch 43', true, '2026-05-28 16:06:55.674629', 16, 2856);
INSERT INTO public.lab_package_branches VALUES (1589, 17, 44, 127, 2599, '24 HR', true, '16% OFF', 'Standard package offered by branch 44', true, '2026-05-28 16:06:55.675753', 16, 3095);
INSERT INTO public.lab_package_branches VALUES (1590, 17, 45, 127, 2299, '48 HR', true, '16% OFF', 'Standard package offered by branch 45', true, '2026-05-28 16:06:55.677145', 16, 2737);
INSERT INTO public.lab_package_branches VALUES (1591, 17, 46, 127, 2499, '24 HR', true, '16% OFF', 'Standard package offered by branch 46', true, '2026-05-28 16:06:55.678389', 16, 2975);
INSERT INTO public.lab_package_branches VALUES (1592, 18, 47, 127, 2699, '48 HR', true, '16% OFF', 'Standard package offered by branch 47', true, '2026-05-28 16:06:55.679867', 16, 3214);
INSERT INTO public.lab_package_branches VALUES (1593, 18, 48, 127, 2399, '24 HR', true, '16% OFF', 'Standard package offered by branch 48', true, '2026-05-28 16:06:55.681208', 16, 2856);
INSERT INTO public.lab_package_branches VALUES (1594, 18, 49, 127, 2599, '48 HR', true, '16% OFF', 'Standard package offered by branch 49', true, '2026-05-28 16:06:55.682819', 16, 3095);
INSERT INTO public.lab_package_branches VALUES (1596, 19, 51, 127, 2499, '48 HR', true, '16% OFF', 'Standard package offered by branch 51', true, '2026-05-28 16:06:55.685662', 16, 2975);
INSERT INTO public.lab_package_branches VALUES (1597, 20, 52, 127, 2699, '24 HR', true, '16% OFF', 'Standard package offered by branch 52', true, '2026-05-28 16:06:55.687342', 16, 3214);
INSERT INTO public.lab_package_branches VALUES (1598, 20, 53, 127, 2399, '48 HR', true, '16% OFF', 'Standard package offered by branch 53', true, '2026-05-28 16:06:55.689237', 16, 2856);
INSERT INTO public.lab_package_branches VALUES (1599, 20, 54, 127, 2599, '24 HR', true, '16% OFF', 'Standard package offered by branch 54', true, '2026-05-28 16:06:55.691099', 16, 3095);
INSERT INTO public.lab_package_branches VALUES (1600, 20, 55, 127, 2299, '48 HR', true, '16% OFF', 'Standard package offered by branch 55', true, '2026-05-28 16:06:55.692846', 16, 2737);
INSERT INTO public.lab_package_branches VALUES (1537, 29, 75, 126, 2299, '48 HR', true, '16% OFF', 'Standard package offered by branch 75', true, '2026-05-28 16:06:55.585347', 16, 2737);
INSERT INTO public.lab_package_branches VALUES (1538, 29, 76, 126, 2499, '24 HR', true, '16% OFF', 'Standard package offered by branch 76', true, '2026-05-28 16:06:55.5868', 16, 2975);
INSERT INTO public.lab_package_branches VALUES (1539, 29, 77, 126, 2699, '48 HR', true, '16% OFF', 'Standard package offered by branch 77', true, '2026-05-28 16:06:55.588029', 16, 3214);
INSERT INTO public.lab_package_branches VALUES (1540, 29, 78, 126, 2399, '24 HR', true, '16% OFF', 'Standard package offered by branch 78', true, '2026-05-28 16:06:55.589327', 16, 2856);
INSERT INTO public.lab_package_branches VALUES (1606, 23, 61, 127, 2499, '48 HR', true, '16% OFF', 'Standard package offered by branch 61', true, '2026-05-28 16:06:55.699955', 16, 2975);
INSERT INTO public.lab_package_branches VALUES (1607, 24, 62, 127, 2699, '24 HR', true, '16% OFF', 'Standard package offered by branch 62', true, '2026-05-28 16:06:55.701179', 16, 3214);
INSERT INTO public.lab_package_branches VALUES (1608, 24, 63, 127, 2399, '48 HR', true, '16% OFF', 'Standard package offered by branch 63', true, '2026-05-28 16:06:55.702431', 16, 2856);
INSERT INTO public.lab_package_branches VALUES (1609, 24, 64, 127, 2599, '24 HR', true, '16% OFF', 'Standard package offered by branch 64', true, '2026-05-28 16:06:55.703571', 16, 3095);
INSERT INTO public.lab_package_branches VALUES (1610, 25, 65, 127, 2299, '48 HR', true, '16% OFF', 'Standard package offered by branch 65', true, '2026-05-28 16:06:55.704774', 16, 2737);
INSERT INTO public.lab_package_branches VALUES (1611, 25, 66, 127, 2499, '24 HR', true, '16% OFF', 'Standard package offered by branch 66', true, '2026-05-28 16:06:55.705928', 16, 2975);
INSERT INTO public.lab_package_branches VALUES (1612, 25, 67, 127, 2699, '48 HR', true, '16% OFF', 'Standard package offered by branch 67', true, '2026-05-28 16:06:55.707273', 16, 3214);
INSERT INTO public.lab_package_branches VALUES (1613, 26, 68, 127, 2399, '24 HR', true, '16% OFF', 'Standard package offered by branch 68', true, '2026-05-28 16:06:55.708423', 16, 2856);
INSERT INTO public.lab_package_branches VALUES (1614, 26, 69, 127, 2599, '48 HR', true, '16% OFF', 'Standard package offered by branch 69', true, '2026-05-28 16:06:55.709671', 16, 3095);
INSERT INTO public.lab_package_branches VALUES (1615, 26, 70, 127, 2299, '24 HR', true, '16% OFF', 'Standard package offered by branch 70', true, '2026-05-28 16:06:55.711194', 16, 2737);
INSERT INTO public.lab_package_branches VALUES (1616, 27, 71, 127, 2499, '48 HR', true, '16% OFF', 'Standard package offered by branch 71', true, '2026-05-28 16:06:55.713076', 16, 2975);
INSERT INTO public.lab_package_branches VALUES (1617, 27, 72, 127, 2699, '24 HR', true, '16% OFF', 'Standard package offered by branch 72', true, '2026-05-28 16:06:55.714541', 16, 3214);
INSERT INTO public.lab_package_branches VALUES (1618, 27, 73, 127, 2399, '48 HR', true, '16% OFF', 'Standard package offered by branch 73', true, '2026-05-28 16:06:55.716224', 16, 2856);
INSERT INTO public.lab_package_branches VALUES (1619, 28, 74, 127, 2599, '24 HR', true, '16% OFF', 'Standard package offered by branch 74', true, '2026-05-28 16:06:55.717465', 16, 3095);
INSERT INTO public.lab_package_branches VALUES (1620, 29, 75, 127, 2299, '48 HR', true, '16% OFF', 'Standard package offered by branch 75', true, '2026-05-28 16:06:55.719134', 16, 2737);
INSERT INTO public.lab_package_branches VALUES (1621, 29, 76, 127, 2499, '24 HR', true, '16% OFF', 'Standard package offered by branch 76', true, '2026-05-28 16:06:55.720772', 16, 2975);
INSERT INTO public.lab_package_branches VALUES (1622, 29, 77, 127, 2699, '48 HR', true, '16% OFF', 'Standard package offered by branch 77', true, '2026-05-28 16:06:55.721937', 16, 3214);
INSERT INTO public.lab_package_branches VALUES (1623, 29, 78, 127, 2399, '24 HR', true, '16% OFF', 'Standard package offered by branch 78', true, '2026-05-28 16:06:55.722987', 16, 2856);
INSERT INTO public.lab_package_branches VALUES (1624, 30, 79, 127, 2599, '48 HR', true, '16% OFF', 'Standard package offered by branch 79', true, '2026-05-28 16:06:55.724155', 16, 3095);
INSERT INTO public.lab_package_branches VALUES (1625, 30, 80, 127, 2299, '24 HR', true, '16% OFF', 'Standard package offered by branch 80', true, '2026-05-28 16:06:55.725426', 16, 2737);
INSERT INTO public.lab_package_branches VALUES (1626, 30, 81, 127, 2499, '48 HR', true, '16% OFF', 'Standard package offered by branch 81', true, '2026-05-28 16:06:55.726653', 16, 2975);
INSERT INTO public.lab_package_branches VALUES (1627, 30, 82, 127, 2699, '24 HR', true, '16% OFF', 'Standard package offered by branch 82', true, '2026-05-28 16:06:55.728306', 16, 3214);
INSERT INTO public.lab_package_branches VALUES (1628, 31, 83, 127, 2399, '48 HR', true, '16% OFF', 'Standard package offered by branch 83', true, '2026-05-28 16:06:55.730057', 16, 2856);
INSERT INTO public.lab_package_branches VALUES (1630, 1, 2, 128, 599, '24 HR', true, '20% OFF', 'Standard package offered by branch 2', true, '2026-05-28 16:06:55.733564', 20, 749);
INSERT INTO public.lab_package_branches VALUES (1631, 1, 3, 128, 299, '48 HR', true, '25% OFF', 'Standard package offered by branch 3', true, '2026-05-28 16:06:55.73509', 25, 399);
INSERT INTO public.lab_package_branches VALUES (1632, 1, 4, 128, 499, '24 HR', true, '20% OFF', 'Standard package offered by branch 4', true, '2026-05-28 16:06:55.736556', 20, 624);
INSERT INTO public.lab_package_branches VALUES (1634, 3, 6, 128, 399, '24 HR', true, '20% OFF', 'Standard package offered by branch 6', true, '2026-05-28 16:06:55.739119', 20, 499);
INSERT INTO public.lab_package_branches VALUES (1635, 3, 7, 128, 599, '48 HR', true, '20% OFF', 'Standard package offered by branch 7', true, '2026-05-28 16:06:55.740282', 20, 749);
INSERT INTO public.lab_package_branches VALUES (1636, 3, 8, 128, 299, '24 HR', true, '25% OFF', 'Standard package offered by branch 8', true, '2026-05-28 16:06:55.741625', 25, 399);
INSERT INTO public.lab_package_branches VALUES (1637, 3, 9, 128, 499, '48 HR', true, '20% OFF', 'Standard package offered by branch 9', true, '2026-05-28 16:06:55.743189', 20, 624);
INSERT INTO public.lab_package_branches VALUES (1638, 4, 10, 128, 299, '24 HR', true, '25% OFF', 'Standard package offered by branch 10', true, '2026-05-28 16:06:55.744909', 25, 399);
INSERT INTO public.lab_package_branches VALUES (1639, 4, 11, 128, 399, '48 HR', true, '20% OFF', 'Standard package offered by branch 11', true, '2026-05-28 16:06:55.746174', 20, 499);
INSERT INTO public.lab_package_branches VALUES (1640, 4, 12, 128, 599, '24 HR', true, '20% OFF', 'Standard package offered by branch 12', true, '2026-05-28 16:06:55.747321', 20, 749);
INSERT INTO public.lab_package_branches VALUES (1641, 4, 13, 128, 299, '48 HR', true, '25% OFF', 'Standard package offered by branch 13', true, '2026-05-28 16:06:55.74839', 25, 399);
INSERT INTO public.lab_package_branches VALUES (1642, 4, 14, 128, 499, '24 HR', true, '20% OFF', 'Standard package offered by branch 14', true, '2026-05-28 16:06:55.749454', 20, 624);
INSERT INTO public.lab_package_branches VALUES (1643, 5, 15, 128, 299, '48 HR', true, '25% OFF', 'Standard package offered by branch 15', true, '2026-05-28 16:06:55.750943', 25, 399);
INSERT INTO public.lab_package_branches VALUES (1644, 6, 16, 128, 399, '24 HR', true, '20% OFF', 'Standard package offered by branch 16', true, '2026-05-28 16:06:55.752966', 20, 499);
INSERT INTO public.lab_package_branches VALUES (1645, 6, 17, 128, 599, '48 HR', true, '20% OFF', 'Standard package offered by branch 17', true, '2026-05-28 16:06:55.754326', 20, 749);
INSERT INTO public.lab_package_branches VALUES (1646, 6, 18, 128, 299, '24 HR', true, '25% OFF', 'Standard package offered by branch 18', true, '2026-05-28 16:06:55.755567', 25, 399);
INSERT INTO public.lab_package_branches VALUES (1647, 6, 19, 128, 499, '48 HR', true, '20% OFF', 'Standard package offered by branch 19', true, '2026-05-28 16:06:55.757203', 20, 624);
INSERT INTO public.lab_package_branches VALUES (1648, 7, 20, 128, 299, '24 HR', true, '25% OFF', 'Standard package offered by branch 20', true, '2026-05-28 16:06:55.759186', 25, 399);
INSERT INTO public.lab_package_branches VALUES (1649, 8, 21, 128, 399, '48 HR', true, '20% OFF', 'Standard package offered by branch 21', true, '2026-05-28 16:06:55.761057', 20, 499);
INSERT INTO public.lab_package_branches VALUES (1650, 8, 22, 128, 599, '24 HR', true, '20% OFF', 'Standard package offered by branch 22', true, '2026-05-28 16:06:55.762703', 20, 749);
INSERT INTO public.lab_package_branches VALUES (1651, 8, 23, 128, 299, '48 HR', true, '25% OFF', 'Standard package offered by branch 23', true, '2026-05-28 16:06:55.764552', 25, 399);
INSERT INTO public.lab_package_branches VALUES (1652, 9, 24, 128, 499, '24 HR', true, '20% OFF', 'Standard package offered by branch 24', true, '2026-05-28 16:06:55.766295', 20, 624);
INSERT INTO public.lab_package_branches VALUES (1653, 10, 25, 128, 299, '48 HR', true, '25% OFF', 'Standard package offered by branch 25', true, '2026-05-28 16:06:55.767811', 25, 399);
INSERT INTO public.lab_package_branches VALUES (1654, 10, 26, 128, 399, '24 HR', true, '20% OFF', 'Standard package offered by branch 26', true, '2026-05-28 16:06:55.769634', 20, 499);
INSERT INTO public.lab_package_branches VALUES (1655, 10, 27, 128, 599, '48 HR', true, '20% OFF', 'Standard package offered by branch 27', true, '2026-05-28 16:06:55.771389', 20, 749);
INSERT INTO public.lab_package_branches VALUES (1656, 11, 28, 128, 299, '24 HR', true, '25% OFF', 'Standard package offered by branch 28', true, '2026-05-28 16:06:55.774604', 25, 399);
INSERT INTO public.lab_package_branches VALUES (1657, 12, 29, 128, 499, '48 HR', true, '20% OFF', 'Standard package offered by branch 29', true, '2026-05-28 16:06:55.776907', 20, 624);
INSERT INTO public.lab_package_branches VALUES (1658, 12, 30, 128, 299, '24 HR', true, '25% OFF', 'Standard package offered by branch 30', true, '2026-05-28 16:06:55.779242', 25, 399);
INSERT INTO public.lab_package_branches VALUES (1659, 12, 31, 128, 399, '48 HR', true, '20% OFF', 'Standard package offered by branch 31', true, '2026-05-28 16:06:55.781202', 20, 499);
INSERT INTO public.lab_package_branches VALUES (1661, 14, 33, 128, 299, '48 HR', true, '25% OFF', 'Standard package offered by branch 33', true, '2026-05-28 16:06:55.784321', 25, 399);
INSERT INTO public.lab_package_branches VALUES (1662, 14, 34, 128, 499, '24 HR', true, '20% OFF', 'Standard package offered by branch 34', true, '2026-05-28 16:06:55.785546', 20, 624);
INSERT INTO public.lab_package_branches VALUES (1663, 14, 35, 128, 299, '48 HR', true, '25% OFF', 'Standard package offered by branch 35', true, '2026-05-28 16:06:55.786854', 25, 399);
INSERT INTO public.lab_package_branches VALUES (1664, 14, 36, 128, 399, '24 HR', true, '20% OFF', 'Standard package offered by branch 36', true, '2026-05-28 16:06:55.788487', 20, 499);
INSERT INTO public.lab_package_branches VALUES (1665, 15, 37, 128, 599, '48 HR', true, '20% OFF', 'Standard package offered by branch 37', true, '2026-05-28 16:06:55.789922', 20, 749);
INSERT INTO public.lab_package_branches VALUES (1602, 21, 57, 127, 2699, '48 HR', true, '16% OFF', 'Standard package offered by branch 57', true, '2026-05-28 16:06:55.695755', 16, 3214);
INSERT INTO public.lab_package_branches VALUES (1603, 22, 58, 127, 2399, '24 HR', true, '16% OFF', 'Standard package offered by branch 58', true, '2026-05-28 16:06:55.6969', 16, 2856);
INSERT INTO public.lab_package_branches VALUES (1604, 22, 59, 127, 2599, '48 HR', true, '16% OFF', 'Standard package offered by branch 59', true, '2026-05-28 16:06:55.697847', 16, 3095);
INSERT INTO public.lab_package_branches VALUES (1605, 22, 60, 127, 2299, '24 HR', true, '16% OFF', 'Standard package offered by branch 60', true, '2026-05-28 16:06:55.698885', 16, 2737);
INSERT INTO public.lab_package_branches VALUES (1633, 2, 5, 128, 299, '48 HR', true, '25% OFF', 'Standard package offered by branch 5', true, '2026-05-28 16:06:55.73811', 25, 399);
INSERT INTO public.lab_package_branches VALUES (1671, 17, 43, 128, 299, '48 HR', true, '25% OFF', 'Standard package offered by branch 43', true, '2026-05-28 16:06:55.799936', 25, 399);
INSERT INTO public.lab_package_branches VALUES (1672, 17, 44, 128, 499, '24 HR', true, '20% OFF', 'Standard package offered by branch 44', true, '2026-05-28 16:06:55.801062', 20, 624);
INSERT INTO public.lab_package_branches VALUES (1673, 17, 45, 128, 299, '48 HR', true, '25% OFF', 'Standard package offered by branch 45', true, '2026-05-28 16:06:55.802413', 25, 399);
INSERT INTO public.lab_package_branches VALUES (1674, 17, 46, 128, 399, '24 HR', true, '20% OFF', 'Standard package offered by branch 46', true, '2026-05-28 16:06:55.803791', 20, 499);
INSERT INTO public.lab_package_branches VALUES (1675, 18, 47, 128, 599, '48 HR', true, '20% OFF', 'Standard package offered by branch 47', true, '2026-05-28 16:06:55.805086', 20, 749);
INSERT INTO public.lab_package_branches VALUES (1676, 18, 48, 128, 299, '24 HR', true, '25% OFF', 'Standard package offered by branch 48', true, '2026-05-28 16:06:55.806211', 25, 399);
INSERT INTO public.lab_package_branches VALUES (1677, 18, 49, 128, 499, '48 HR', true, '20% OFF', 'Standard package offered by branch 49', true, '2026-05-28 16:06:55.807484', 20, 624);
INSERT INTO public.lab_package_branches VALUES (1678, 18, 50, 128, 299, '24 HR', true, '25% OFF', 'Standard package offered by branch 50', true, '2026-05-28 16:06:55.808974', 25, 399);
INSERT INTO public.lab_package_branches VALUES (1679, 19, 51, 128, 399, '48 HR', true, '20% OFF', 'Standard package offered by branch 51', true, '2026-05-28 16:06:55.810415', 20, 499);
INSERT INTO public.lab_package_branches VALUES (1680, 20, 52, 128, 599, '24 HR', true, '20% OFF', 'Standard package offered by branch 52', true, '2026-05-28 16:06:55.811519', 20, 749);
INSERT INTO public.lab_package_branches VALUES (1681, 20, 53, 128, 299, '48 HR', true, '25% OFF', 'Standard package offered by branch 53', true, '2026-05-28 16:06:55.812732', 25, 399);
INSERT INTO public.lab_package_branches VALUES (1682, 20, 54, 128, 499, '24 HR', true, '20% OFF', 'Standard package offered by branch 54', true, '2026-05-28 16:06:55.81507', 20, 624);
INSERT INTO public.lab_package_branches VALUES (1683, 20, 55, 128, 299, '48 HR', true, '25% OFF', 'Standard package offered by branch 55', true, '2026-05-28 16:06:55.816317', 25, 399);
INSERT INTO public.lab_package_branches VALUES (1684, 21, 56, 128, 399, '24 HR', true, '20% OFF', 'Standard package offered by branch 56', true, '2026-05-28 16:06:55.817745', 20, 499);
INSERT INTO public.lab_package_branches VALUES (1685, 21, 57, 128, 599, '48 HR', true, '20% OFF', 'Standard package offered by branch 57', true, '2026-05-28 16:06:55.819343', 20, 749);
INSERT INTO public.lab_package_branches VALUES (1686, 22, 58, 128, 299, '24 HR', true, '25% OFF', 'Standard package offered by branch 58', true, '2026-05-28 16:06:55.820899', 25, 399);
INSERT INTO public.lab_package_branches VALUES (1687, 22, 59, 128, 499, '48 HR', true, '20% OFF', 'Standard package offered by branch 59', true, '2026-05-28 16:06:55.822455', 20, 624);
INSERT INTO public.lab_package_branches VALUES (1688, 22, 60, 128, 299, '24 HR', true, '25% OFF', 'Standard package offered by branch 60', true, '2026-05-28 16:06:55.82415', 25, 399);
INSERT INTO public.lab_package_branches VALUES (1689, 23, 61, 128, 399, '48 HR', true, '20% OFF', 'Standard package offered by branch 61', true, '2026-05-28 16:06:55.825605', 20, 499);
INSERT INTO public.lab_package_branches VALUES (1690, 24, 62, 128, 599, '24 HR', true, '20% OFF', 'Standard package offered by branch 62', true, '2026-05-28 16:06:55.82699', 20, 749);
INSERT INTO public.lab_package_branches VALUES (1691, 24, 63, 128, 299, '48 HR', true, '25% OFF', 'Standard package offered by branch 63', true, '2026-05-28 16:06:55.828687', 25, 399);
INSERT INTO public.lab_package_branches VALUES (1692, 24, 64, 128, 499, '24 HR', true, '20% OFF', 'Standard package offered by branch 64', true, '2026-05-28 16:06:55.830497', 20, 624);
INSERT INTO public.lab_package_branches VALUES (1693, 25, 65, 128, 299, '48 HR', true, '25% OFF', 'Standard package offered by branch 65', true, '2026-05-28 16:06:55.832348', 25, 399);
INSERT INTO public.lab_package_branches VALUES (1695, 25, 67, 128, 599, '48 HR', true, '20% OFF', 'Standard package offered by branch 67', true, '2026-05-28 16:06:55.83591', 20, 749);
INSERT INTO public.lab_package_branches VALUES (1696, 26, 68, 128, 299, '24 HR', true, '25% OFF', 'Standard package offered by branch 68', true, '2026-05-28 16:06:55.83732', 25, 399);
INSERT INTO public.lab_package_branches VALUES (1697, 26, 69, 128, 499, '48 HR', true, '20% OFF', 'Standard package offered by branch 69', true, '2026-05-28 16:06:55.838974', 20, 624);
INSERT INTO public.lab_package_branches VALUES (1698, 26, 70, 128, 299, '24 HR', true, '25% OFF', 'Standard package offered by branch 70', true, '2026-05-28 16:06:55.840851', 25, 399);
INSERT INTO public.lab_package_branches VALUES (1699, 27, 71, 128, 399, '48 HR', true, '20% OFF', 'Standard package offered by branch 71', true, '2026-05-28 16:06:55.84262', 20, 499);
INSERT INTO public.lab_package_branches VALUES (1700, 27, 72, 128, 599, '24 HR', true, '20% OFF', 'Standard package offered by branch 72', true, '2026-05-28 16:06:55.844426', 20, 749);
INSERT INTO public.lab_package_branches VALUES (1701, 27, 73, 128, 299, '48 HR', true, '25% OFF', 'Standard package offered by branch 73', true, '2026-05-28 16:06:55.846116', 25, 399);
INSERT INTO public.lab_package_branches VALUES (1702, 28, 74, 128, 499, '24 HR', true, '20% OFF', 'Standard package offered by branch 74', true, '2026-05-28 16:06:55.847312', 20, 624);
INSERT INTO public.lab_package_branches VALUES (1703, 29, 75, 128, 299, '48 HR', true, '25% OFF', 'Standard package offered by branch 75', true, '2026-05-28 16:06:55.848374', 25, 399);
INSERT INTO public.lab_package_branches VALUES (1704, 29, 76, 128, 399, '24 HR', true, '20% OFF', 'Standard package offered by branch 76', true, '2026-05-28 16:06:55.851511', 20, 499);
INSERT INTO public.lab_package_branches VALUES (1705, 29, 77, 128, 599, '48 HR', true, '20% OFF', 'Standard package offered by branch 77', true, '2026-05-28 16:06:55.853165', 20, 749);
INSERT INTO public.lab_package_branches VALUES (1706, 29, 78, 128, 299, '24 HR', true, '25% OFF', 'Standard package offered by branch 78', true, '2026-05-28 16:06:55.855999', 25, 399);
INSERT INTO public.lab_package_branches VALUES (1707, 30, 79, 128, 499, '48 HR', true, '20% OFF', 'Standard package offered by branch 79', true, '2026-05-28 16:06:55.857729', 20, 624);
INSERT INTO public.lab_package_branches VALUES (1708, 30, 80, 128, 299, '24 HR', true, '25% OFF', 'Standard package offered by branch 80', true, '2026-05-28 16:06:55.859986', 25, 399);
INSERT INTO public.lab_package_branches VALUES (1709, 30, 81, 128, 399, '48 HR', true, '20% OFF', 'Standard package offered by branch 81', true, '2026-05-28 16:06:55.861569', 20, 499);
INSERT INTO public.lab_package_branches VALUES (1710, 30, 82, 128, 599, '24 HR', true, '20% OFF', 'Standard package offered by branch 82', true, '2026-05-28 16:06:55.863025', 20, 749);
INSERT INTO public.lab_package_branches VALUES (1711, 31, 83, 128, 299, '48 HR', true, '25% OFF', 'Standard package offered by branch 83', true, '2026-05-28 16:06:55.864492', 25, 399);
INSERT INTO public.lab_package_branches VALUES (1712, 1, 1, 129, 399, '48 HR', true, '20% OFF', 'Standard package offered by branch 1', true, '2026-05-28 16:06:55.865799', 20, 499);
INSERT INTO public.lab_package_branches VALUES (1713, 1, 2, 129, 599, '24 HR', true, '20% OFF', 'Standard package offered by branch 2', true, '2026-05-28 16:06:55.867186', 20, 749);
INSERT INTO public.lab_package_branches VALUES (1715, 1, 4, 129, 499, '24 HR', true, '20% OFF', 'Standard package offered by branch 4', true, '2026-05-28 16:06:55.869919', 20, 624);
INSERT INTO public.lab_package_branches VALUES (1716, 2, 5, 129, 299, '48 HR', true, '25% OFF', 'Standard package offered by branch 5', true, '2026-05-28 16:06:55.871231', 25, 399);
INSERT INTO public.lab_package_branches VALUES (1717, 3, 6, 129, 399, '24 HR', true, '20% OFF', 'Standard package offered by branch 6', true, '2026-05-28 16:06:55.872631', 20, 499);
INSERT INTO public.lab_package_branches VALUES (1718, 3, 7, 129, 599, '48 HR', true, '20% OFF', 'Standard package offered by branch 7', true, '2026-05-28 16:06:55.874062', 20, 749);
INSERT INTO public.lab_package_branches VALUES (1719, 3, 8, 129, 299, '24 HR', true, '25% OFF', 'Standard package offered by branch 8', true, '2026-05-28 16:06:55.875356', 25, 399);
INSERT INTO public.lab_package_branches VALUES (1720, 3, 9, 129, 499, '48 HR', true, '20% OFF', 'Standard package offered by branch 9', true, '2026-05-28 16:06:55.877147', 20, 624);
INSERT INTO public.lab_package_branches VALUES (1721, 4, 10, 129, 299, '24 HR', true, '25% OFF', 'Standard package offered by branch 10', true, '2026-05-28 16:06:55.878583', 25, 399);
INSERT INTO public.lab_package_branches VALUES (1722, 4, 11, 129, 399, '48 HR', true, '20% OFF', 'Standard package offered by branch 11', true, '2026-05-28 16:06:55.879988', 20, 499);
INSERT INTO public.lab_package_branches VALUES (1723, 4, 12, 129, 599, '24 HR', true, '20% OFF', 'Standard package offered by branch 12', true, '2026-05-28 16:06:55.881699', 20, 749);
INSERT INTO public.lab_package_branches VALUES (1724, 4, 13, 129, 299, '48 HR', true, '25% OFF', 'Standard package offered by branch 13', true, '2026-05-28 16:06:55.883527', 25, 399);
INSERT INTO public.lab_package_branches VALUES (1726, 5, 15, 129, 299, '48 HR', true, '25% OFF', 'Standard package offered by branch 15', true, '2026-05-28 16:06:55.887664', 25, 399);
INSERT INTO public.lab_package_branches VALUES (1727, 6, 16, 129, 399, '24 HR', true, '20% OFF', 'Standard package offered by branch 16', true, '2026-05-28 16:06:55.891217', 20, 499);
INSERT INTO public.lab_package_branches VALUES (1728, 6, 17, 129, 599, '48 HR', true, '20% OFF', 'Standard package offered by branch 17', true, '2026-05-28 16:06:55.894161', 20, 749);
INSERT INTO public.lab_package_branches VALUES (1729, 6, 18, 129, 299, '24 HR', true, '25% OFF', 'Standard package offered by branch 18', true, '2026-05-28 16:06:55.896464', 25, 399);
INSERT INTO public.lab_package_branches VALUES (1730, 6, 19, 129, 499, '48 HR', true, '20% OFF', 'Standard package offered by branch 19', true, '2026-05-28 16:06:55.898166', 20, 624);
INSERT INTO public.lab_package_branches VALUES (1667, 16, 39, 128, 499, '48 HR', true, '20% OFF', 'Standard package offered by branch 39', true, '2026-05-28 16:06:55.794188', 20, 624);
INSERT INTO public.lab_package_branches VALUES (1668, 16, 40, 128, 299, '24 HR', true, '25% OFF', 'Standard package offered by branch 40', true, '2026-05-28 16:06:55.796024', 25, 399);
INSERT INTO public.lab_package_branches VALUES (1669, 16, 41, 128, 399, '48 HR', true, '20% OFF', 'Standard package offered by branch 41', true, '2026-05-28 16:06:55.797295', 20, 499);
INSERT INTO public.lab_package_branches VALUES (1714, 1, 3, 129, 299, '48 HR', true, '25% OFF', 'Standard package offered by branch 3', true, '2026-05-28 16:06:55.868457', 25, 399);
INSERT INTO public.lab_package_branches VALUES (1670, 17, 42, 128, 599, '24 HR', true, '20% OFF', 'Standard package offered by branch 42', true, '2026-05-28 16:06:55.798588', 20, 749);
INSERT INTO public.lab_package_branches VALUES (1736, 10, 25, 129, 299, '48 HR', true, '25% OFF', 'Standard package offered by branch 25', true, '2026-05-28 16:06:55.911118', 25, 399);
INSERT INTO public.lab_package_branches VALUES (1737, 10, 26, 129, 399, '24 HR', true, '20% OFF', 'Standard package offered by branch 26', true, '2026-05-28 16:06:55.912656', 20, 499);
INSERT INTO public.lab_package_branches VALUES (1738, 10, 27, 129, 599, '48 HR', true, '20% OFF', 'Standard package offered by branch 27', true, '2026-05-28 16:06:55.914258', 20, 749);
INSERT INTO public.lab_package_branches VALUES (1739, 11, 28, 129, 299, '24 HR', true, '25% OFF', 'Standard package offered by branch 28', true, '2026-05-28 16:06:55.922599', 25, 399);
INSERT INTO public.lab_package_branches VALUES (1740, 12, 29, 129, 499, '48 HR', true, '20% OFF', 'Standard package offered by branch 29', true, '2026-05-28 16:06:55.933182', 20, 624);
INSERT INTO public.lab_package_branches VALUES (1741, 12, 30, 129, 299, '24 HR', true, '25% OFF', 'Standard package offered by branch 30', true, '2026-05-28 16:06:55.937493', 25, 399);
INSERT INTO public.lab_package_branches VALUES (1742, 12, 31, 129, 399, '48 HR', true, '20% OFF', 'Standard package offered by branch 31', true, '2026-05-28 16:06:55.941108', 20, 499);
INSERT INTO public.lab_package_branches VALUES (1743, 13, 32, 129, 599, '24 HR', true, '20% OFF', 'Standard package offered by branch 32', true, '2026-05-28 16:06:55.945026', 20, 749);
INSERT INTO public.lab_package_branches VALUES (1744, 14, 33, 129, 299, '48 HR', true, '25% OFF', 'Standard package offered by branch 33', true, '2026-05-28 16:06:55.947553', 25, 399);
INSERT INTO public.lab_package_branches VALUES (1745, 14, 34, 129, 499, '24 HR', true, '20% OFF', 'Standard package offered by branch 34', true, '2026-05-28 16:06:55.950008', 20, 624);
INSERT INTO public.lab_package_branches VALUES (1746, 14, 35, 129, 299, '48 HR', true, '25% OFF', 'Standard package offered by branch 35', true, '2026-05-28 16:06:55.953814', 25, 399);
INSERT INTO public.lab_package_branches VALUES (1747, 14, 36, 129, 399, '24 HR', true, '20% OFF', 'Standard package offered by branch 36', true, '2026-05-28 16:06:55.956092', 20, 499);
INSERT INTO public.lab_package_branches VALUES (1748, 15, 37, 129, 599, '48 HR', true, '20% OFF', 'Standard package offered by branch 37', true, '2026-05-28 16:06:55.958997', 20, 749);
INSERT INTO public.lab_package_branches VALUES (1749, 16, 38, 129, 299, '24 HR', true, '25% OFF', 'Standard package offered by branch 38', true, '2026-05-28 16:06:55.961337', 25, 399);
INSERT INTO public.lab_package_branches VALUES (1750, 16, 39, 129, 499, '48 HR', true, '20% OFF', 'Standard package offered by branch 39', true, '2026-05-28 16:06:55.963376', 20, 624);
INSERT INTO public.lab_package_branches VALUES (1751, 16, 40, 129, 299, '24 HR', true, '25% OFF', 'Standard package offered by branch 40', true, '2026-05-28 16:06:55.964991', 25, 399);
INSERT INTO public.lab_package_branches VALUES (1752, 16, 41, 129, 399, '48 HR', true, '20% OFF', 'Standard package offered by branch 41', true, '2026-05-28 16:06:55.966585', 20, 499);
INSERT INTO public.lab_package_branches VALUES (1753, 17, 42, 129, 599, '24 HR', true, '20% OFF', 'Standard package offered by branch 42', true, '2026-05-28 16:06:55.968068', 20, 749);
INSERT INTO public.lab_package_branches VALUES (1754, 17, 43, 129, 299, '48 HR', true, '25% OFF', 'Standard package offered by branch 43', true, '2026-05-28 16:06:55.969653', 25, 399);
INSERT INTO public.lab_package_branches VALUES (1755, 17, 44, 129, 499, '24 HR', true, '20% OFF', 'Standard package offered by branch 44', true, '2026-05-28 16:06:55.971062', 20, 624);
INSERT INTO public.lab_package_branches VALUES (1756, 17, 45, 129, 299, '48 HR', true, '25% OFF', 'Standard package offered by branch 45', true, '2026-05-28 16:06:55.972387', 25, 399);
INSERT INTO public.lab_package_branches VALUES (1757, 17, 46, 129, 399, '24 HR', true, '20% OFF', 'Standard package offered by branch 46', true, '2026-05-28 16:06:55.973647', 20, 499);
INSERT INTO public.lab_package_branches VALUES (1758, 18, 47, 129, 599, '48 HR', true, '20% OFF', 'Standard package offered by branch 47', true, '2026-05-28 16:06:55.975063', 20, 749);
INSERT INTO public.lab_package_branches VALUES (1760, 18, 49, 129, 499, '48 HR', true, '20% OFF', 'Standard package offered by branch 49', true, '2026-05-28 16:06:55.977895', 20, 624);
INSERT INTO public.lab_package_branches VALUES (1761, 18, 50, 129, 299, '24 HR', true, '25% OFF', 'Standard package offered by branch 50', true, '2026-05-28 16:06:55.979358', 25, 399);
INSERT INTO public.lab_package_branches VALUES (1762, 19, 51, 129, 399, '48 HR', true, '20% OFF', 'Standard package offered by branch 51', true, '2026-05-28 16:06:55.980788', 20, 499);
INSERT INTO public.lab_package_branches VALUES (1763, 20, 52, 129, 599, '24 HR', true, '20% OFF', 'Standard package offered by branch 52', true, '2026-05-28 16:06:55.981976', 20, 749);
INSERT INTO public.lab_package_branches VALUES (1764, 20, 53, 129, 299, '48 HR', true, '25% OFF', 'Standard package offered by branch 53', true, '2026-05-28 16:06:55.983146', 25, 399);
INSERT INTO public.lab_package_branches VALUES (1765, 20, 54, 129, 499, '24 HR', true, '20% OFF', 'Standard package offered by branch 54', true, '2026-05-28 16:06:55.9846', 20, 624);
INSERT INTO public.lab_package_branches VALUES (1766, 20, 55, 129, 299, '48 HR', true, '25% OFF', 'Standard package offered by branch 55', true, '2026-05-28 16:06:55.985642', 25, 399);
INSERT INTO public.lab_package_branches VALUES (1767, 21, 56, 129, 399, '24 HR', true, '20% OFF', 'Standard package offered by branch 56', true, '2026-05-28 16:06:55.986882', 20, 499);
INSERT INTO public.lab_package_branches VALUES (1768, 21, 57, 129, 599, '48 HR', true, '20% OFF', 'Standard package offered by branch 57', true, '2026-05-28 16:06:55.988049', 20, 749);
INSERT INTO public.lab_package_branches VALUES (1769, 22, 58, 129, 299, '24 HR', true, '25% OFF', 'Standard package offered by branch 58', true, '2026-05-28 16:06:55.989149', 25, 399);
INSERT INTO public.lab_package_branches VALUES (1770, 22, 59, 129, 499, '48 HR', true, '20% OFF', 'Standard package offered by branch 59', true, '2026-05-28 16:06:55.990258', 20, 624);
INSERT INTO public.lab_package_branches VALUES (1771, 22, 60, 129, 299, '24 HR', true, '25% OFF', 'Standard package offered by branch 60', true, '2026-05-28 16:06:55.991596', 25, 399);
INSERT INTO public.lab_package_branches VALUES (1772, 23, 61, 129, 399, '48 HR', true, '20% OFF', 'Standard package offered by branch 61', true, '2026-05-28 16:06:55.992996', 20, 499);
INSERT INTO public.lab_package_branches VALUES (1773, 24, 62, 129, 599, '24 HR', true, '20% OFF', 'Standard package offered by branch 62', true, '2026-05-28 16:06:55.994753', 20, 749);
INSERT INTO public.lab_package_branches VALUES (1774, 24, 63, 129, 299, '48 HR', true, '25% OFF', 'Standard package offered by branch 63', true, '2026-05-28 16:06:55.996659', 25, 399);
INSERT INTO public.lab_package_branches VALUES (1775, 24, 64, 129, 499, '24 HR', true, '20% OFF', 'Standard package offered by branch 64', true, '2026-05-28 16:06:55.997961', 20, 624);
INSERT INTO public.lab_package_branches VALUES (1776, 25, 65, 129, 299, '48 HR', true, '25% OFF', 'Standard package offered by branch 65', true, '2026-05-28 16:06:55.999092', 25, 399);
INSERT INTO public.lab_package_branches VALUES (1777, 25, 66, 129, 399, '24 HR', true, '20% OFF', 'Standard package offered by branch 66', true, '2026-05-28 16:06:56.000492', 20, 499);
INSERT INTO public.lab_package_branches VALUES (1778, 25, 67, 129, 599, '48 HR', true, '20% OFF', 'Standard package offered by branch 67', true, '2026-05-28 16:06:56.001778', 20, 749);
INSERT INTO public.lab_package_branches VALUES (1779, 26, 68, 129, 299, '24 HR', true, '25% OFF', 'Standard package offered by branch 68', true, '2026-05-28 16:06:56.00303', 25, 399);
INSERT INTO public.lab_package_branches VALUES (1780, 26, 69, 129, 499, '48 HR', true, '20% OFF', 'Standard package offered by branch 69', true, '2026-05-28 16:06:56.004327', 20, 624);
INSERT INTO public.lab_package_branches VALUES (1781, 26, 70, 129, 299, '24 HR', true, '25% OFF', 'Standard package offered by branch 70', true, '2026-05-28 16:06:56.005829', 25, 399);
INSERT INTO public.lab_package_branches VALUES (1782, 27, 71, 129, 399, '48 HR', true, '20% OFF', 'Standard package offered by branch 71', true, '2026-05-28 16:06:56.007339', 20, 499);
INSERT INTO public.lab_package_branches VALUES (1783, 27, 72, 129, 599, '24 HR', true, '20% OFF', 'Standard package offered by branch 72', true, '2026-05-28 16:06:56.00867', 20, 749);
INSERT INTO public.lab_package_branches VALUES (1784, 27, 73, 129, 299, '48 HR', true, '25% OFF', 'Standard package offered by branch 73', true, '2026-05-28 16:06:56.009977', 25, 399);
INSERT INTO public.lab_package_branches VALUES (1785, 28, 74, 129, 499, '24 HR', true, '20% OFF', 'Standard package offered by branch 74', true, '2026-05-28 16:06:56.011261', 20, 624);
INSERT INTO public.lab_package_branches VALUES (1786, 29, 75, 129, 299, '48 HR', true, '25% OFF', 'Standard package offered by branch 75', true, '2026-05-28 16:06:56.012519', 25, 399);
INSERT INTO public.lab_package_branches VALUES (1787, 29, 76, 129, 399, '24 HR', true, '20% OFF', 'Standard package offered by branch 76', true, '2026-05-28 16:06:56.013949', 20, 499);
INSERT INTO public.lab_package_branches VALUES (1788, 29, 77, 129, 599, '48 HR', true, '20% OFF', 'Standard package offered by branch 77', true, '2026-05-28 16:06:56.01501', 20, 749);
INSERT INTO public.lab_package_branches VALUES (1789, 29, 78, 129, 299, '24 HR', true, '25% OFF', 'Standard package offered by branch 78', true, '2026-05-28 16:06:56.016057', 25, 399);
INSERT INTO public.lab_package_branches VALUES (1791, 30, 80, 129, 299, '24 HR', true, '25% OFF', 'Standard package offered by branch 80', true, '2026-05-28 16:06:56.018114', 25, 399);
INSERT INTO public.lab_package_branches VALUES (1792, 30, 81, 129, 399, '48 HR', true, '20% OFF', 'Standard package offered by branch 81', true, '2026-05-28 16:06:56.019437', 20, 499);
INSERT INTO public.lab_package_branches VALUES (1793, 30, 82, 129, 599, '24 HR', true, '20% OFF', 'Standard package offered by branch 82', true, '2026-05-28 16:06:56.020337', 20, 749);
INSERT INTO public.lab_package_branches VALUES (1794, 31, 83, 129, 299, '48 HR', true, '25% OFF', 'Standard package offered by branch 83', true, '2026-05-28 16:06:56.021313', 25, 399);
INSERT INTO public.lab_package_branches VALUES (1795, 1, 1, 130, 1299, '48 HR', true, '48% OFF', 'Standard package offered by branch 1', true, '2026-05-28 16:06:56.022377', 48, 2499);
INSERT INTO public.lab_package_branches VALUES (1732, 8, 21, 129, 399, '48 HR', true, '20% OFF', 'Standard package offered by branch 21', true, '2026-05-28 16:06:55.903156', 20, 499);
INSERT INTO public.lab_package_branches VALUES (1733, 8, 22, 129, 599, '24 HR', true, '20% OFF', 'Standard package offered by branch 22', true, '2026-05-28 16:06:55.905273', 20, 749);
INSERT INTO public.lab_package_branches VALUES (1734, 8, 23, 129, 299, '48 HR', true, '25% OFF', 'Standard package offered by branch 23', true, '2026-05-28 16:06:55.907271', 25, 399);
INSERT INTO public.lab_package_branches VALUES (1735, 9, 24, 129, 499, '24 HR', true, '20% OFF', 'Standard package offered by branch 24', true, '2026-05-28 16:06:55.90914', 20, 624);
INSERT INTO public.lab_package_branches VALUES (1801, 3, 7, 130, 1499, '48 HR', true, '48% OFF', 'Standard package offered by branch 7', true, '2026-05-28 16:06:56.029051', 48, 2883);
INSERT INTO public.lab_package_branches VALUES (1802, 3, 8, 130, 1199, '24 HR', true, '48% OFF', 'Standard package offered by branch 8', true, '2026-05-28 16:06:56.029933', 48, 2306);
INSERT INTO public.lab_package_branches VALUES (1803, 3, 9, 130, 1399, '48 HR', true, '48% OFF', 'Standard package offered by branch 9', true, '2026-05-28 16:06:56.030972', 48, 2691);
INSERT INTO public.lab_package_branches VALUES (1804, 4, 10, 130, 1099, '24 HR', true, '48% OFF', 'Standard package offered by branch 10', true, '2026-05-28 16:06:56.03214', 48, 2114);
INSERT INTO public.lab_package_branches VALUES (1805, 4, 11, 130, 1299, '48 HR', true, '48% OFF', 'Standard package offered by branch 11', true, '2026-05-28 16:06:56.033202', 48, 2499);
INSERT INTO public.lab_package_branches VALUES (1806, 4, 12, 130, 1499, '24 HR', true, '48% OFF', 'Standard package offered by branch 12', true, '2026-05-28 16:06:56.034233', 48, 2883);
INSERT INTO public.lab_package_branches VALUES (1807, 4, 13, 130, 1199, '48 HR', true, '48% OFF', 'Standard package offered by branch 13', true, '2026-05-28 16:06:56.035468', 48, 2306);
INSERT INTO public.lab_package_branches VALUES (1808, 4, 14, 130, 1399, '24 HR', true, '48% OFF', 'Standard package offered by branch 14', true, '2026-05-28 16:06:56.036858', 48, 2691);
INSERT INTO public.lab_package_branches VALUES (1809, 5, 15, 130, 1099, '48 HR', true, '48% OFF', 'Standard package offered by branch 15', true, '2026-05-28 16:06:56.03801', 48, 2114);
INSERT INTO public.lab_package_branches VALUES (1810, 6, 16, 130, 1299, '24 HR', true, '48% OFF', 'Standard package offered by branch 16', true, '2026-05-28 16:06:56.040779', 48, 2499);
INSERT INTO public.lab_package_branches VALUES (1811, 6, 17, 130, 1499, '48 HR', true, '48% OFF', 'Standard package offered by branch 17', true, '2026-05-28 16:06:56.042681', 48, 2883);
INSERT INTO public.lab_package_branches VALUES (1812, 6, 18, 130, 1199, '24 HR', true, '48% OFF', 'Standard package offered by branch 18', true, '2026-05-28 16:06:56.044149', 48, 2306);
INSERT INTO public.lab_package_branches VALUES (1813, 6, 19, 130, 1399, '48 HR', true, '48% OFF', 'Standard package offered by branch 19', true, '2026-05-28 16:06:56.045609', 48, 2691);
INSERT INTO public.lab_package_branches VALUES (1814, 7, 20, 130, 1099, '24 HR', true, '48% OFF', 'Standard package offered by branch 20', true, '2026-05-28 16:06:56.046992', 48, 2114);
INSERT INTO public.lab_package_branches VALUES (1815, 8, 21, 130, 1299, '48 HR', true, '48% OFF', 'Standard package offered by branch 21', true, '2026-05-28 16:06:56.048291', 48, 2499);
INSERT INTO public.lab_package_branches VALUES (1816, 8, 22, 130, 1499, '24 HR', true, '48% OFF', 'Standard package offered by branch 22', true, '2026-05-28 16:06:56.049877', 48, 2883);
INSERT INTO public.lab_package_branches VALUES (1817, 8, 23, 130, 1199, '48 HR', true, '48% OFF', 'Standard package offered by branch 23', true, '2026-05-28 16:06:56.051394', 48, 2306);
INSERT INTO public.lab_package_branches VALUES (1818, 9, 24, 130, 1399, '24 HR', true, '48% OFF', 'Standard package offered by branch 24', true, '2026-05-28 16:06:56.052461', 48, 2691);
INSERT INTO public.lab_package_branches VALUES (1819, 10, 25, 130, 1099, '48 HR', true, '48% OFF', 'Standard package offered by branch 25', true, '2026-05-28 16:06:56.053563', 48, 2114);
INSERT INTO public.lab_package_branches VALUES (1820, 10, 26, 130, 1299, '24 HR', true, '48% OFF', 'Standard package offered by branch 26', true, '2026-05-28 16:06:56.054672', 48, 2499);
INSERT INTO public.lab_package_branches VALUES (1821, 10, 27, 130, 1499, '48 HR', true, '48% OFF', 'Standard package offered by branch 27', true, '2026-05-28 16:06:56.05587', 48, 2883);
INSERT INTO public.lab_package_branches VALUES (1822, 11, 28, 130, 1199, '24 HR', true, '48% OFF', 'Standard package offered by branch 28', true, '2026-05-28 16:06:56.057499', 48, 2306);
INSERT INTO public.lab_package_branches VALUES (1823, 12, 29, 130, 1399, '48 HR', true, '48% OFF', 'Standard package offered by branch 29', true, '2026-05-28 16:06:56.058894', 48, 2691);
INSERT INTO public.lab_package_branches VALUES (1825, 12, 31, 130, 1299, '48 HR', true, '48% OFF', 'Standard package offered by branch 31', true, '2026-05-28 16:06:56.060999', 48, 2499);
INSERT INTO public.lab_package_branches VALUES (1826, 13, 32, 130, 1499, '24 HR', true, '48% OFF', 'Standard package offered by branch 32', true, '2026-05-28 16:06:56.061906', 48, 2883);
INSERT INTO public.lab_package_branches VALUES (1827, 14, 33, 130, 1199, '48 HR', true, '48% OFF', 'Standard package offered by branch 33', true, '2026-05-28 16:06:56.062827', 48, 2306);
INSERT INTO public.lab_package_branches VALUES (1828, 14, 34, 130, 1399, '24 HR', true, '48% OFF', 'Standard package offered by branch 34', true, '2026-05-28 16:06:56.063882', 48, 2691);
INSERT INTO public.lab_package_branches VALUES (1829, 14, 35, 130, 1099, '48 HR', true, '48% OFF', 'Standard package offered by branch 35', true, '2026-05-28 16:06:56.064952', 48, 2114);
INSERT INTO public.lab_package_branches VALUES (1830, 14, 36, 130, 1299, '24 HR', true, '48% OFF', 'Standard package offered by branch 36', true, '2026-05-28 16:06:56.066234', 48, 2499);
INSERT INTO public.lab_package_branches VALUES (1831, 15, 37, 130, 1499, '48 HR', true, '48% OFF', 'Standard package offered by branch 37', true, '2026-05-28 16:06:56.067591', 48, 2883);
INSERT INTO public.lab_package_branches VALUES (1832, 16, 38, 130, 1199, '24 HR', true, '48% OFF', 'Standard package offered by branch 38', true, '2026-05-28 16:06:56.0689', 48, 2306);
INSERT INTO public.lab_package_branches VALUES (1833, 16, 39, 130, 1399, '48 HR', true, '48% OFF', 'Standard package offered by branch 39', true, '2026-05-28 16:06:56.070289', 48, 2691);
INSERT INTO public.lab_package_branches VALUES (1834, 16, 40, 130, 1099, '24 HR', true, '48% OFF', 'Standard package offered by branch 40', true, '2026-05-28 16:06:56.071589', 48, 2114);
INSERT INTO public.lab_package_branches VALUES (1835, 16, 41, 130, 1299, '48 HR', true, '48% OFF', 'Standard package offered by branch 41', true, '2026-05-28 16:06:56.07284', 48, 2499);
INSERT INTO public.lab_package_branches VALUES (1836, 17, 42, 130, 1499, '24 HR', true, '48% OFF', 'Standard package offered by branch 42', true, '2026-05-28 16:06:56.074295', 48, 2883);
INSERT INTO public.lab_package_branches VALUES (1837, 17, 43, 130, 1199, '48 HR', true, '48% OFF', 'Standard package offered by branch 43', true, '2026-05-28 16:06:56.075855', 48, 2306);
INSERT INTO public.lab_package_branches VALUES (1838, 17, 44, 130, 1399, '24 HR', true, '48% OFF', 'Standard package offered by branch 44', true, '2026-05-28 16:06:56.077339', 48, 2691);
INSERT INTO public.lab_package_branches VALUES (1839, 17, 45, 130, 1099, '48 HR', true, '48% OFF', 'Standard package offered by branch 45', true, '2026-05-28 16:06:56.07855', 48, 2114);
INSERT INTO public.lab_package_branches VALUES (1840, 17, 46, 130, 1299, '24 HR', true, '48% OFF', 'Standard package offered by branch 46', true, '2026-05-28 16:06:56.079913', 48, 2499);
INSERT INTO public.lab_package_branches VALUES (1841, 18, 47, 130, 1499, '48 HR', true, '48% OFF', 'Standard package offered by branch 47', true, '2026-05-28 16:06:56.081323', 48, 2883);
INSERT INTO public.lab_package_branches VALUES (1842, 18, 48, 130, 1199, '24 HR', true, '48% OFF', 'Standard package offered by branch 48', true, '2026-05-28 16:06:56.082419', 48, 2306);
INSERT INTO public.lab_package_branches VALUES (1843, 18, 49, 130, 1399, '48 HR', true, '48% OFF', 'Standard package offered by branch 49', true, '2026-05-28 16:06:56.083669', 48, 2691);
INSERT INTO public.lab_package_branches VALUES (1844, 18, 50, 130, 1099, '24 HR', true, '48% OFF', 'Standard package offered by branch 50', true, '2026-05-28 16:06:56.08487', 48, 2114);
INSERT INTO public.lab_package_branches VALUES (1845, 19, 51, 130, 1299, '48 HR', true, '48% OFF', 'Standard package offered by branch 51', true, '2026-05-28 16:06:56.086019', 48, 2499);
INSERT INTO public.lab_package_branches VALUES (1846, 20, 52, 130, 1499, '24 HR', true, '48% OFF', 'Standard package offered by branch 52', true, '2026-05-28 16:06:56.087095', 48, 2883);
INSERT INTO public.lab_package_branches VALUES (1847, 20, 53, 130, 1199, '48 HR', true, '48% OFF', 'Standard package offered by branch 53', true, '2026-05-28 16:06:56.088173', 48, 2306);
INSERT INTO public.lab_package_branches VALUES (1848, 20, 54, 130, 1399, '24 HR', true, '48% OFF', 'Standard package offered by branch 54', true, '2026-05-28 16:06:56.089261', 48, 2691);
INSERT INTO public.lab_package_branches VALUES (1849, 20, 55, 130, 1099, '48 HR', true, '48% OFF', 'Standard package offered by branch 55', true, '2026-05-28 16:06:56.090727', 48, 2114);
INSERT INTO public.lab_package_branches VALUES (1850, 21, 56, 130, 1299, '24 HR', true, '48% OFF', 'Standard package offered by branch 56', true, '2026-05-28 16:06:56.091996', 48, 2499);
INSERT INTO public.lab_package_branches VALUES (1851, 21, 57, 130, 1499, '48 HR', true, '48% OFF', 'Standard package offered by branch 57', true, '2026-05-28 16:06:56.09333', 48, 2883);
INSERT INTO public.lab_package_branches VALUES (1852, 22, 58, 130, 1199, '24 HR', true, '48% OFF', 'Standard package offered by branch 58', true, '2026-05-28 16:06:56.094522', 48, 2306);
INSERT INTO public.lab_package_branches VALUES (1853, 22, 59, 130, 1399, '48 HR', true, '48% OFF', 'Standard package offered by branch 59', true, '2026-05-28 16:06:56.096349', 48, 2691);
INSERT INTO public.lab_package_branches VALUES (1854, 22, 60, 130, 1099, '24 HR', true, '48% OFF', 'Standard package offered by branch 60', true, '2026-05-28 16:06:56.097924', 48, 2114);
INSERT INTO public.lab_package_branches VALUES (1856, 24, 62, 130, 1499, '24 HR', true, '48% OFF', 'Standard package offered by branch 62', true, '2026-05-28 16:06:56.100418', 48, 2883);
INSERT INTO public.lab_package_branches VALUES (1857, 24, 63, 130, 1199, '48 HR', true, '48% OFF', 'Standard package offered by branch 63', true, '2026-05-28 16:06:56.101804', 48, 2306);
INSERT INTO public.lab_package_branches VALUES (1858, 24, 64, 130, 1399, '24 HR', true, '48% OFF', 'Standard package offered by branch 64', true, '2026-05-28 16:06:56.103631', 48, 2691);
INSERT INTO public.lab_package_branches VALUES (1859, 25, 65, 130, 1099, '48 HR', true, '48% OFF', 'Standard package offered by branch 65', true, '2026-05-28 16:06:56.104891', 48, 2114);
INSERT INTO public.lab_package_branches VALUES (1860, 25, 66, 130, 1299, '24 HR', true, '48% OFF', 'Standard package offered by branch 66', true, '2026-05-28 16:06:56.106043', 48, 2499);
INSERT INTO public.lab_package_branches VALUES (1797, 1, 3, 130, 1199, '48 HR', true, '48% OFF', 'Standard package offered by branch 3', true, '2026-05-28 16:06:56.025013', 48, 2306);
INSERT INTO public.lab_package_branches VALUES (1798, 1, 4, 130, 1399, '24 HR', true, '48% OFF', 'Standard package offered by branch 4', true, '2026-05-28 16:06:56.026159', 48, 2691);
INSERT INTO public.lab_package_branches VALUES (1799, 2, 5, 130, 1099, '48 HR', true, '48% OFF', 'Standard package offered by branch 5', true, '2026-05-28 16:06:56.027112', 48, 2114);
INSERT INTO public.lab_package_branches VALUES (1800, 3, 6, 130, 1299, '24 HR', true, '48% OFF', 'Standard package offered by branch 6', true, '2026-05-28 16:06:56.027968', 48, 2499);
INSERT INTO public.lab_package_branches VALUES (1883, 3, 6, 131, 1299, '24 HR', true, '48% OFF', 'Standard package offered by branch 6', true, '2026-05-28 16:06:56.132173', 48, 2499);
INSERT INTO public.lab_package_branches VALUES (1884, 3, 7, 131, 1499, '48 HR', true, '48% OFF', 'Standard package offered by branch 7', true, '2026-05-28 16:06:56.133271', 48, 2883);
INSERT INTO public.lab_package_branches VALUES (1885, 3, 8, 131, 1199, '24 HR', true, '48% OFF', 'Standard package offered by branch 8', true, '2026-05-28 16:06:56.134489', 48, 2306);
INSERT INTO public.lab_package_branches VALUES (1886, 3, 9, 131, 1399, '48 HR', true, '48% OFF', 'Standard package offered by branch 9', true, '2026-05-28 16:06:56.135449', 48, 2691);
INSERT INTO public.lab_package_branches VALUES (1887, 4, 10, 131, 1099, '24 HR', true, '48% OFF', 'Standard package offered by branch 10', true, '2026-05-28 16:06:56.136423', 48, 2114);
INSERT INTO public.lab_package_branches VALUES (1888, 4, 11, 131, 1299, '48 HR', true, '48% OFF', 'Standard package offered by branch 11', true, '2026-05-28 16:06:56.137738', 48, 2499);
INSERT INTO public.lab_package_branches VALUES (1889, 4, 12, 131, 1499, '24 HR', true, '48% OFF', 'Standard package offered by branch 12', true, '2026-05-28 16:06:56.138944', 48, 2883);
INSERT INTO public.lab_package_branches VALUES (1890, 4, 13, 131, 1199, '48 HR', true, '48% OFF', 'Standard package offered by branch 13', true, '2026-05-28 16:06:56.139887', 48, 2306);
INSERT INTO public.lab_package_branches VALUES (1891, 4, 14, 131, 1399, '24 HR', true, '48% OFF', 'Standard package offered by branch 14', true, '2026-05-28 16:06:56.147668', 48, 2691);
INSERT INTO public.lab_package_branches VALUES (1892, 5, 15, 131, 1099, '48 HR', true, '48% OFF', 'Standard package offered by branch 15', true, '2026-05-28 16:06:56.150113', 48, 2114);
INSERT INTO public.lab_package_branches VALUES (1893, 6, 16, 131, 1299, '24 HR', true, '48% OFF', 'Standard package offered by branch 16', true, '2026-05-28 16:06:56.15151', 48, 2499);
INSERT INTO public.lab_package_branches VALUES (1894, 6, 17, 131, 1499, '48 HR', true, '48% OFF', 'Standard package offered by branch 17', true, '2026-05-28 16:06:56.155938', 48, 2883);
INSERT INTO public.lab_package_branches VALUES (1895, 6, 18, 131, 1199, '24 HR', true, '48% OFF', 'Standard package offered by branch 18', true, '2026-05-28 16:06:56.15794', 48, 2306);
INSERT INTO public.lab_package_branches VALUES (1896, 6, 19, 131, 1399, '48 HR', true, '48% OFF', 'Standard package offered by branch 19', true, '2026-05-28 16:06:56.159643', 48, 2691);
INSERT INTO public.lab_package_branches VALUES (1897, 7, 20, 131, 1099, '24 HR', true, '48% OFF', 'Standard package offered by branch 20', true, '2026-05-28 16:06:56.161064', 48, 2114);
INSERT INTO public.lab_package_branches VALUES (1898, 8, 21, 131, 1299, '48 HR', true, '48% OFF', 'Standard package offered by branch 21', true, '2026-05-28 16:06:56.162583', 48, 2499);
INSERT INTO public.lab_package_branches VALUES (1899, 8, 22, 131, 1499, '24 HR', true, '48% OFF', 'Standard package offered by branch 22', true, '2026-05-28 16:06:56.164037', 48, 2883);
INSERT INTO public.lab_package_branches VALUES (1900, 8, 23, 131, 1199, '48 HR', true, '48% OFF', 'Standard package offered by branch 23', true, '2026-05-28 16:06:56.165922', 48, 2306);
INSERT INTO public.lab_package_branches VALUES (1901, 9, 24, 131, 1399, '24 HR', true, '48% OFF', 'Standard package offered by branch 24', true, '2026-05-28 16:06:56.167528', 48, 2691);
INSERT INTO public.lab_package_branches VALUES (1902, 10, 25, 131, 1099, '48 HR', true, '48% OFF', 'Standard package offered by branch 25', true, '2026-05-28 16:06:56.16887', 48, 2114);
INSERT INTO public.lab_package_branches VALUES (1903, 10, 26, 131, 1299, '24 HR', true, '48% OFF', 'Standard package offered by branch 26', true, '2026-05-28 16:06:56.170175', 48, 2499);
INSERT INTO public.lab_package_branches VALUES (1904, 10, 27, 131, 1499, '48 HR', true, '48% OFF', 'Standard package offered by branch 27', true, '2026-05-28 16:06:56.171484', 48, 2883);
INSERT INTO public.lab_package_branches VALUES (1905, 11, 28, 131, 1199, '24 HR', true, '48% OFF', 'Standard package offered by branch 28', true, '2026-05-28 16:06:56.177199', 48, 2306);
INSERT INTO public.lab_package_branches VALUES (1907, 12, 30, 131, 1099, '24 HR', true, '48% OFF', 'Standard package offered by branch 30', true, '2026-05-28 16:06:56.181464', 48, 2114);
INSERT INTO public.lab_package_branches VALUES (1908, 12, 31, 131, 1299, '48 HR', true, '48% OFF', 'Standard package offered by branch 31', true, '2026-05-28 16:06:56.183111', 48, 2499);
INSERT INTO public.lab_package_branches VALUES (1909, 13, 32, 131, 1499, '24 HR', true, '48% OFF', 'Standard package offered by branch 32', true, '2026-05-28 16:06:56.184412', 48, 2883);
INSERT INTO public.lab_package_branches VALUES (1910, 14, 33, 131, 1199, '48 HR', true, '48% OFF', 'Standard package offered by branch 33', true, '2026-05-28 16:06:56.185644', 48, 2306);
INSERT INTO public.lab_package_branches VALUES (1911, 14, 34, 131, 1399, '24 HR', true, '48% OFF', 'Standard package offered by branch 34', true, '2026-05-28 16:06:56.186998', 48, 2691);
INSERT INTO public.lab_package_branches VALUES (1912, 14, 35, 131, 1099, '48 HR', true, '48% OFF', 'Standard package offered by branch 35', true, '2026-05-28 16:06:56.188175', 48, 2114);
INSERT INTO public.lab_package_branches VALUES (1913, 14, 36, 131, 1299, '24 HR', true, '48% OFF', 'Standard package offered by branch 36', true, '2026-05-28 16:06:56.189203', 48, 2499);
INSERT INTO public.lab_package_branches VALUES (1914, 15, 37, 131, 1499, '48 HR', true, '48% OFF', 'Standard package offered by branch 37', true, '2026-05-28 16:06:56.190304', 48, 2883);
INSERT INTO public.lab_package_branches VALUES (1915, 16, 38, 131, 1199, '24 HR', true, '48% OFF', 'Standard package offered by branch 38', true, '2026-05-28 16:06:56.191854', 48, 2306);
INSERT INTO public.lab_package_branches VALUES (1916, 16, 39, 131, 1399, '48 HR', true, '48% OFF', 'Standard package offered by branch 39', true, '2026-05-28 16:06:56.193189', 48, 2691);
INSERT INTO public.lab_package_branches VALUES (1917, 16, 40, 131, 1099, '24 HR', true, '48% OFF', 'Standard package offered by branch 40', true, '2026-05-28 16:06:56.19468', 48, 2114);
INSERT INTO public.lab_package_branches VALUES (1918, 16, 41, 131, 1299, '48 HR', true, '48% OFF', 'Standard package offered by branch 41', true, '2026-05-28 16:06:56.196009', 48, 2499);
INSERT INTO public.lab_package_branches VALUES (1919, 17, 42, 131, 1499, '24 HR', true, '48% OFF', 'Standard package offered by branch 42', true, '2026-05-28 16:06:56.197335', 48, 2883);
INSERT INTO public.lab_package_branches VALUES (1920, 17, 43, 131, 1199, '48 HR', true, '48% OFF', 'Standard package offered by branch 43', true, '2026-05-28 16:06:56.198441', 48, 2306);
INSERT INTO public.lab_package_branches VALUES (1921, 17, 44, 131, 1399, '24 HR', true, '48% OFF', 'Standard package offered by branch 44', true, '2026-05-28 16:06:56.199493', 48, 2691);
INSERT INTO public.lab_package_branches VALUES (1922, 17, 45, 131, 1099, '48 HR', true, '48% OFF', 'Standard package offered by branch 45', true, '2026-05-28 16:06:56.200648', 48, 2114);
INSERT INTO public.lab_package_branches VALUES (1923, 17, 46, 131, 1299, '24 HR', true, '48% OFF', 'Standard package offered by branch 46', true, '2026-05-28 16:06:56.201922', 48, 2499);
INSERT INTO public.lab_package_branches VALUES (1924, 18, 47, 131, 1499, '48 HR', true, '48% OFF', 'Standard package offered by branch 47', true, '2026-05-28 16:06:56.203754', 48, 2883);
INSERT INTO public.lab_package_branches VALUES (1925, 18, 48, 131, 1199, '24 HR', true, '48% OFF', 'Standard package offered by branch 48', true, '2026-05-28 16:06:56.209824', 48, 2306);
INSERT INTO public.lab_package_branches VALUES (1861, 25, 67, 130, 1499, '48 HR', true, '48% OFF', 'Standard package offered by branch 67', true, '2026-05-28 16:06:56.107524', 48, 2883);
INSERT INTO public.lab_package_branches VALUES (1863, 26, 69, 130, 1399, '48 HR', true, '48% OFF', 'Standard package offered by branch 69', true, '2026-05-28 16:06:56.110142', 48, 2691);
INSERT INTO public.lab_package_branches VALUES (1864, 26, 70, 130, 1099, '24 HR', true, '48% OFF', 'Standard package offered by branch 70', true, '2026-05-28 16:06:56.111165', 48, 2114);
INSERT INTO public.lab_package_branches VALUES (1865, 27, 71, 130, 1299, '48 HR', true, '48% OFF', 'Standard package offered by branch 71', true, '2026-05-28 16:06:56.112261', 48, 2499);
INSERT INTO public.lab_package_branches VALUES (1866, 27, 72, 130, 1499, '24 HR', true, '48% OFF', 'Standard package offered by branch 72', true, '2026-05-28 16:06:56.113294', 48, 2883);
INSERT INTO public.lab_package_branches VALUES (1867, 27, 73, 130, 1199, '48 HR', true, '48% OFF', 'Standard package offered by branch 73', true, '2026-05-28 16:06:56.114397', 48, 2306);
INSERT INTO public.lab_package_branches VALUES (1868, 28, 74, 130, 1399, '24 HR', true, '48% OFF', 'Standard package offered by branch 74', true, '2026-05-28 16:06:56.115725', 48, 2691);
INSERT INTO public.lab_package_branches VALUES (1869, 29, 75, 130, 1099, '48 HR', true, '48% OFF', 'Standard package offered by branch 75', true, '2026-05-28 16:06:56.116957', 48, 2114);
INSERT INTO public.lab_package_branches VALUES (1870, 29, 76, 130, 1299, '24 HR', true, '48% OFF', 'Standard package offered by branch 76', true, '2026-05-28 16:06:56.118153', 48, 2499);
INSERT INTO public.lab_package_branches VALUES (1871, 29, 77, 130, 1499, '48 HR', true, '48% OFF', 'Standard package offered by branch 77', true, '2026-05-28 16:06:56.119242', 48, 2883);
INSERT INTO public.lab_package_branches VALUES (1873, 30, 79, 130, 1399, '48 HR', true, '48% OFF', 'Standard package offered by branch 79', true, '2026-05-28 16:06:56.121234', 48, 2691);
INSERT INTO public.lab_package_branches VALUES (1874, 30, 80, 130, 1099, '24 HR', true, '48% OFF', 'Standard package offered by branch 80', true, '2026-05-28 16:06:56.122036', 48, 2114);
INSERT INTO public.lab_package_branches VALUES (1875, 30, 81, 130, 1299, '48 HR', true, '48% OFF', 'Standard package offered by branch 81', true, '2026-05-28 16:06:56.12283', 48, 2499);
INSERT INTO public.lab_package_branches VALUES (1876, 30, 82, 130, 1499, '24 HR', true, '48% OFF', 'Standard package offered by branch 82', true, '2026-05-28 16:06:56.12378', 48, 2883);
INSERT INTO public.lab_package_branches VALUES (1877, 31, 83, 130, 1199, '48 HR', true, '48% OFF', 'Standard package offered by branch 83', true, '2026-05-28 16:06:56.124579', 48, 2306);
INSERT INTO public.lab_package_branches VALUES (1879, 1, 2, 131, 1499, '24 HR', true, '48% OFF', 'Standard package offered by branch 2', true, '2026-05-28 16:06:56.127096', 48, 2883);
INSERT INTO public.lab_package_branches VALUES (1880, 1, 3, 131, 1199, '48 HR', true, '48% OFF', 'Standard package offered by branch 3', true, '2026-05-28 16:06:56.128353', 48, 2306);
INSERT INTO public.lab_package_branches VALUES (1862, 26, 68, 130, 1199, '24 HR', true, '48% OFF', 'Standard package offered by branch 68', true, '2026-05-28 16:06:56.109141', 48, 2306);
INSERT INTO public.lab_package_branches VALUES (1881, 1, 4, 131, 1399, '24 HR', true, '48% OFF', 'Standard package offered by branch 4', true, '2026-05-28 16:06:56.130132', 48, 2691);
INSERT INTO public.lab_package_branches VALUES (1882, 2, 5, 131, 1099, '48 HR', true, '48% OFF', 'Standard package offered by branch 5', true, '2026-05-28 16:06:56.131149', 48, 2114);
INSERT INTO public.lab_package_branches VALUES (1931, 20, 54, 131, 1399, '24 HR', true, '48% OFF', 'Standard package offered by branch 54', true, '2026-05-28 16:06:56.217636', 48, 2691);
INSERT INTO public.lab_package_branches VALUES (1932, 20, 55, 131, 1099, '48 HR', true, '48% OFF', 'Standard package offered by branch 55', true, '2026-05-28 16:06:56.218691', 48, 2114);
INSERT INTO public.lab_package_branches VALUES (1933, 21, 56, 131, 1299, '24 HR', true, '48% OFF', 'Standard package offered by branch 56', true, '2026-05-28 16:06:56.21988', 48, 2499);
INSERT INTO public.lab_package_branches VALUES (1934, 21, 57, 131, 1499, '48 HR', true, '48% OFF', 'Standard package offered by branch 57', true, '2026-05-28 16:06:56.22146', 48, 2883);
INSERT INTO public.lab_package_branches VALUES (1935, 22, 58, 131, 1199, '24 HR', true, '48% OFF', 'Standard package offered by branch 58', true, '2026-05-28 16:06:56.223231', 48, 2306);
INSERT INTO public.lab_package_branches VALUES (1936, 22, 59, 131, 1399, '48 HR', true, '48% OFF', 'Standard package offered by branch 59', true, '2026-05-28 16:06:56.224923', 48, 2691);
INSERT INTO public.lab_package_branches VALUES (1937, 22, 60, 131, 1099, '24 HR', true, '48% OFF', 'Standard package offered by branch 60', true, '2026-05-28 16:06:56.226352', 48, 2114);
INSERT INTO public.lab_package_branches VALUES (1938, 23, 61, 131, 1299, '48 HR', true, '48% OFF', 'Standard package offered by branch 61', true, '2026-05-28 16:06:56.227545', 48, 2499);
INSERT INTO public.lab_package_branches VALUES (1939, 24, 62, 131, 1499, '24 HR', true, '48% OFF', 'Standard package offered by branch 62', true, '2026-05-28 16:06:56.228749', 48, 2883);
INSERT INTO public.lab_package_branches VALUES (1940, 24, 63, 131, 1199, '48 HR', true, '48% OFF', 'Standard package offered by branch 63', true, '2026-05-28 16:06:56.229825', 48, 2306);
INSERT INTO public.lab_package_branches VALUES (1941, 24, 64, 131, 1399, '24 HR', true, '48% OFF', 'Standard package offered by branch 64', true, '2026-05-28 16:06:56.230988', 48, 2691);
INSERT INTO public.lab_package_branches VALUES (1942, 25, 65, 131, 1099, '48 HR', true, '48% OFF', 'Standard package offered by branch 65', true, '2026-05-28 16:06:56.231962', 48, 2114);
INSERT INTO public.lab_package_branches VALUES (1943, 25, 66, 131, 1299, '24 HR', true, '48% OFF', 'Standard package offered by branch 66', true, '2026-05-28 16:06:56.23303', 48, 2499);
INSERT INTO public.lab_package_branches VALUES (1944, 25, 67, 131, 1499, '48 HR', true, '48% OFF', 'Standard package offered by branch 67', true, '2026-05-28 16:06:56.234177', 48, 2883);
INSERT INTO public.lab_package_branches VALUES (1945, 26, 68, 131, 1199, '24 HR', true, '48% OFF', 'Standard package offered by branch 68', true, '2026-05-28 16:06:56.235387', 48, 2306);
INSERT INTO public.lab_package_branches VALUES (1946, 26, 69, 131, 1399, '48 HR', true, '48% OFF', 'Standard package offered by branch 69', true, '2026-05-28 16:06:56.236701', 48, 2691);
INSERT INTO public.lab_package_branches VALUES (1947, 26, 70, 131, 1099, '24 HR', true, '48% OFF', 'Standard package offered by branch 70', true, '2026-05-28 16:06:56.238087', 48, 2114);
INSERT INTO public.lab_package_branches VALUES (1948, 27, 71, 131, 1299, '48 HR', true, '48% OFF', 'Standard package offered by branch 71', true, '2026-05-28 16:06:56.23957', 48, 2499);
INSERT INTO public.lab_package_branches VALUES (1949, 27, 72, 131, 1499, '24 HR', true, '48% OFF', 'Standard package offered by branch 72', true, '2026-05-28 16:06:56.240935', 48, 2883);
INSERT INTO public.lab_package_branches VALUES (1950, 27, 73, 131, 1199, '48 HR', true, '48% OFF', 'Standard package offered by branch 73', true, '2026-05-28 16:06:56.242176', 48, 2306);
INSERT INTO public.lab_package_branches VALUES (1951, 28, 74, 131, 1399, '24 HR', true, '48% OFF', 'Standard package offered by branch 74', true, '2026-05-28 16:06:56.243413', 48, 2691);
INSERT INTO public.lab_package_branches VALUES (1952, 29, 75, 131, 1099, '48 HR', true, '48% OFF', 'Standard package offered by branch 75', true, '2026-05-28 16:06:56.244613', 48, 2114);
INSERT INTO public.lab_package_branches VALUES (1953, 29, 76, 131, 1299, '24 HR', true, '48% OFF', 'Standard package offered by branch 76', true, '2026-05-28 16:06:56.246371', 48, 2499);
INSERT INTO public.lab_package_branches VALUES (1955, 29, 78, 131, 1199, '24 HR', true, '48% OFF', 'Standard package offered by branch 78', true, '2026-05-28 16:06:56.2487', 48, 2306);
INSERT INTO public.lab_package_branches VALUES (1956, 30, 79, 131, 1399, '48 HR', true, '48% OFF', 'Standard package offered by branch 79', true, '2026-05-28 16:06:56.249808', 48, 2691);
INSERT INTO public.lab_package_branches VALUES (1957, 30, 80, 131, 1099, '24 HR', true, '48% OFF', 'Standard package offered by branch 80', true, '2026-05-28 16:06:56.250998', 48, 2114);
INSERT INTO public.lab_package_branches VALUES (1958, 30, 81, 131, 1299, '48 HR', true, '48% OFF', 'Standard package offered by branch 81', true, '2026-05-28 16:06:56.252454', 48, 2499);
INSERT INTO public.lab_package_branches VALUES (1959, 30, 82, 131, 1499, '24 HR', true, '48% OFF', 'Standard package offered by branch 82', true, '2026-05-28 16:06:56.253964', 48, 2883);
INSERT INTO public.lab_package_branches VALUES (1960, 31, 83, 131, 1199, '48 HR', true, '48% OFF', 'Standard package offered by branch 83', true, '2026-05-28 16:06:56.255684', 48, 2306);
INSERT INTO public.lab_package_branches VALUES (1961, 1, 1, 132, 1299, '48 HR', true, '48% OFF', 'Standard package offered by branch 1', true, '2026-05-28 16:06:56.257209', 48, 2499);
INSERT INTO public.lab_package_branches VALUES (1927, 18, 50, 131, 1099, '24 HR', true, '48% OFF', 'Standard package offered by branch 50', true, '2026-05-28 16:06:56.213334', 48, 2114);
INSERT INTO public.lab_package_branches VALUES (1963, 1, 3, 132, 1199, '48 HR', true, '48% OFF', 'Standard package offered by branch 3', true, '2026-05-28 16:06:56.260063', 48, 2306);
INSERT INTO public.lab_package_branches VALUES (1964, 1, 4, 132, 1399, '24 HR', true, '48% OFF', 'Standard package offered by branch 4', true, '2026-05-28 16:06:56.261681', 48, 2691);
INSERT INTO public.lab_package_branches VALUES (1965, 2, 5, 132, 1099, '48 HR', true, '48% OFF', 'Standard package offered by branch 5', true, '2026-05-28 16:06:56.263176', 48, 2114);
INSERT INTO public.lab_package_branches VALUES (1966, 3, 6, 132, 1299, '24 HR', true, '48% OFF', 'Standard package offered by branch 6', true, '2026-05-28 16:06:56.264736', 48, 2499);
INSERT INTO public.lab_package_branches VALUES (1967, 3, 7, 132, 1499, '48 HR', true, '48% OFF', 'Standard package offered by branch 7', true, '2026-05-28 16:06:56.265983', 48, 2883);
INSERT INTO public.lab_package_branches VALUES (1968, 3, 8, 132, 1199, '24 HR', true, '48% OFF', 'Standard package offered by branch 8', true, '2026-05-28 16:06:56.267229', 48, 2306);
INSERT INTO public.lab_package_branches VALUES (1969, 3, 9, 132, 1399, '48 HR', true, '48% OFF', 'Standard package offered by branch 9', true, '2026-05-28 16:06:56.268622', 48, 2691);
INSERT INTO public.lab_package_branches VALUES (1970, 4, 10, 132, 1099, '24 HR', true, '48% OFF', 'Standard package offered by branch 10', true, '2026-05-28 16:06:56.270021', 48, 2114);
INSERT INTO public.lab_package_branches VALUES (1971, 4, 11, 132, 1299, '48 HR', true, '48% OFF', 'Standard package offered by branch 11', true, '2026-05-28 16:06:56.27136', 48, 2499);
INSERT INTO public.lab_package_branches VALUES (1972, 4, 12, 132, 1499, '24 HR', true, '48% OFF', 'Standard package offered by branch 12', true, '2026-05-28 16:06:56.273232', 48, 2883);
INSERT INTO public.lab_package_branches VALUES (1973, 4, 13, 132, 1199, '48 HR', true, '48% OFF', 'Standard package offered by branch 13', true, '2026-05-28 16:06:56.27517', 48, 2306);
INSERT INTO public.lab_package_branches VALUES (1974, 4, 14, 132, 1399, '24 HR', true, '48% OFF', 'Standard package offered by branch 14', true, '2026-05-28 16:06:56.276582', 48, 2691);
INSERT INTO public.lab_package_branches VALUES (1975, 5, 15, 132, 1099, '48 HR', true, '48% OFF', 'Standard package offered by branch 15', true, '2026-05-28 16:06:56.277843', 48, 2114);
INSERT INTO public.lab_package_branches VALUES (1976, 6, 16, 132, 1299, '24 HR', true, '48% OFF', 'Standard package offered by branch 16', true, '2026-05-28 16:06:56.279083', 48, 2499);
INSERT INTO public.lab_package_branches VALUES (1977, 6, 17, 132, 1499, '48 HR', true, '48% OFF', 'Standard package offered by branch 17', true, '2026-05-28 16:06:56.280322', 48, 2883);
INSERT INTO public.lab_package_branches VALUES (1978, 6, 18, 132, 1199, '24 HR', true, '48% OFF', 'Standard package offered by branch 18', true, '2026-05-28 16:06:56.281504', 48, 2306);
INSERT INTO public.lab_package_branches VALUES (1979, 6, 19, 132, 1399, '48 HR', true, '48% OFF', 'Standard package offered by branch 19', true, '2026-05-28 16:06:56.282591', 48, 2691);
INSERT INTO public.lab_package_branches VALUES (1980, 7, 20, 132, 1099, '24 HR', true, '48% OFF', 'Standard package offered by branch 20', true, '2026-05-28 16:06:56.2836', 48, 2114);
INSERT INTO public.lab_package_branches VALUES (1981, 8, 21, 132, 1299, '48 HR', true, '48% OFF', 'Standard package offered by branch 21', true, '2026-05-28 16:06:56.284628', 48, 2499);
INSERT INTO public.lab_package_branches VALUES (1982, 8, 22, 132, 1499, '24 HR', true, '48% OFF', 'Standard package offered by branch 22', true, '2026-05-28 16:06:56.285653', 48, 2883);
INSERT INTO public.lab_package_branches VALUES (1983, 8, 23, 132, 1199, '48 HR', true, '48% OFF', 'Standard package offered by branch 23', true, '2026-05-28 16:06:56.286922', 48, 2306);
INSERT INTO public.lab_package_branches VALUES (1984, 9, 24, 132, 1399, '24 HR', true, '48% OFF', 'Standard package offered by branch 24', true, '2026-05-28 16:06:56.288217', 48, 2691);
INSERT INTO public.lab_package_branches VALUES (1986, 10, 26, 132, 1299, '24 HR', true, '48% OFF', 'Standard package offered by branch 26', true, '2026-05-28 16:06:56.291009', 48, 2499);
INSERT INTO public.lab_package_branches VALUES (1987, 10, 27, 132, 1499, '48 HR', true, '48% OFF', 'Standard package offered by branch 27', true, '2026-05-28 16:06:56.29227', 48, 2883);
INSERT INTO public.lab_package_branches VALUES (1988, 11, 28, 132, 1199, '24 HR', true, '48% OFF', 'Standard package offered by branch 28', true, '2026-05-28 16:06:56.293528', 48, 2306);
INSERT INTO public.lab_package_branches VALUES (1989, 12, 29, 132, 1399, '48 HR', true, '48% OFF', 'Standard package offered by branch 29', true, '2026-05-28 16:06:56.294741', 48, 2691);
INSERT INTO public.lab_package_branches VALUES (1990, 12, 30, 132, 1099, '24 HR', true, '48% OFF', 'Standard package offered by branch 30', true, '2026-05-28 16:06:56.295864', 48, 2114);
INSERT INTO public.lab_package_branches VALUES (1928, 19, 51, 131, 1299, '48 HR', true, '48% OFF', 'Standard package offered by branch 51', true, '2026-05-28 16:06:56.214556', 48, 2499);
INSERT INTO public.lab_package_branches VALUES (1962, 1, 2, 132, 1499, '24 HR', true, '48% OFF', 'Standard package offered by branch 2', true, '2026-05-28 16:06:56.258783', 48, 2883);
INSERT INTO public.lab_package_branches VALUES (1929, 20, 52, 131, 1499, '24 HR', true, '48% OFF', 'Standard package offered by branch 52', true, '2026-05-28 16:06:56.215726', 48, 2883);
INSERT INTO public.lab_package_branches VALUES (1930, 20, 53, 131, 1199, '48 HR', true, '48% OFF', 'Standard package offered by branch 53', true, '2026-05-28 16:06:56.216659', 48, 2306);
INSERT INTO public.lab_package_branches VALUES (1996, 14, 36, 132, 1299, '24 HR', true, '48% OFF', 'Standard package offered by branch 36', true, '2026-05-28 16:06:56.303731', 48, 2499);
INSERT INTO public.lab_package_branches VALUES (1997, 15, 37, 132, 1499, '48 HR', true, '48% OFF', 'Standard package offered by branch 37', true, '2026-05-28 16:06:56.305221', 48, 2883);
INSERT INTO public.lab_package_branches VALUES (1998, 16, 38, 132, 1199, '24 HR', true, '48% OFF', 'Standard package offered by branch 38', true, '2026-05-28 16:06:56.306503', 48, 2306);
INSERT INTO public.lab_package_branches VALUES (1999, 16, 39, 132, 1399, '48 HR', true, '48% OFF', 'Standard package offered by branch 39', true, '2026-05-28 16:06:56.308126', 48, 2691);
INSERT INTO public.lab_package_branches VALUES (2000, 16, 40, 132, 1099, '24 HR', true, '48% OFF', 'Standard package offered by branch 40', true, '2026-05-28 16:06:56.309477', 48, 2114);
INSERT INTO public.lab_package_branches VALUES (2001, 16, 41, 132, 1299, '48 HR', true, '48% OFF', 'Standard package offered by branch 41', true, '2026-05-28 16:06:56.310823', 48, 2499);
INSERT INTO public.lab_package_branches VALUES (2002, 17, 42, 132, 1499, '24 HR', true, '48% OFF', 'Standard package offered by branch 42', true, '2026-05-28 16:06:56.312124', 48, 2883);
INSERT INTO public.lab_package_branches VALUES (2003, 17, 43, 132, 1199, '48 HR', true, '48% OFF', 'Standard package offered by branch 43', true, '2026-05-28 16:06:56.313345', 48, 2306);
INSERT INTO public.lab_package_branches VALUES (2004, 17, 44, 132, 1399, '24 HR', true, '48% OFF', 'Standard package offered by branch 44', true, '2026-05-28 16:06:56.314506', 48, 2691);
INSERT INTO public.lab_package_branches VALUES (2005, 17, 45, 132, 1099, '48 HR', true, '48% OFF', 'Standard package offered by branch 45', true, '2026-05-28 16:06:56.315695', 48, 2114);
INSERT INTO public.lab_package_branches VALUES (2006, 17, 46, 132, 1299, '24 HR', true, '48% OFF', 'Standard package offered by branch 46', true, '2026-05-28 16:06:56.326862', 48, 2499);
INSERT INTO public.lab_package_branches VALUES (2007, 18, 47, 132, 1499, '48 HR', true, '48% OFF', 'Standard package offered by branch 47', true, '2026-05-28 16:06:56.329022', 48, 2883);
INSERT INTO public.lab_package_branches VALUES (2008, 18, 48, 132, 1199, '24 HR', true, '48% OFF', 'Standard package offered by branch 48', true, '2026-05-28 16:06:56.330279', 48, 2306);
INSERT INTO public.lab_package_branches VALUES (2009, 18, 49, 132, 1399, '48 HR', true, '48% OFF', 'Standard package offered by branch 49', true, '2026-05-28 16:06:56.331538', 48, 2691);
INSERT INTO public.lab_package_branches VALUES (2010, 18, 50, 132, 1099, '24 HR', true, '48% OFF', 'Standard package offered by branch 50', true, '2026-05-28 16:06:56.332656', 48, 2114);
INSERT INTO public.lab_package_branches VALUES (2011, 19, 51, 132, 1299, '48 HR', true, '48% OFF', 'Standard package offered by branch 51', true, '2026-05-28 16:06:56.334074', 48, 2499);
INSERT INTO public.lab_package_branches VALUES (2012, 20, 52, 132, 1499, '24 HR', true, '48% OFF', 'Standard package offered by branch 52', true, '2026-05-28 16:06:56.335856', 48, 2883);
INSERT INTO public.lab_package_branches VALUES (2013, 20, 53, 132, 1199, '48 HR', true, '48% OFF', 'Standard package offered by branch 53', true, '2026-05-28 16:06:56.337741', 48, 2306);
INSERT INTO public.lab_package_branches VALUES (2014, 20, 54, 132, 1399, '24 HR', true, '48% OFF', 'Standard package offered by branch 54', true, '2026-05-28 16:06:56.338964', 48, 2691);
INSERT INTO public.lab_package_branches VALUES (2015, 20, 55, 132, 1099, '48 HR', true, '48% OFF', 'Standard package offered by branch 55', true, '2026-05-28 16:06:56.340101', 48, 2114);
INSERT INTO public.lab_package_branches VALUES (2016, 21, 56, 132, 1299, '24 HR', true, '48% OFF', 'Standard package offered by branch 56', true, '2026-05-28 16:06:56.34133', 48, 2499);
INSERT INTO public.lab_package_branches VALUES (2017, 21, 57, 132, 1499, '48 HR', true, '48% OFF', 'Standard package offered by branch 57', true, '2026-05-28 16:06:56.342362', 48, 2883);
INSERT INTO public.lab_package_branches VALUES (2018, 22, 58, 132, 1199, '24 HR', true, '48% OFF', 'Standard package offered by branch 58', true, '2026-05-28 16:06:56.343689', 48, 2306);
INSERT INTO public.lab_package_branches VALUES (2020, 22, 60, 132, 1099, '24 HR', true, '48% OFF', 'Standard package offered by branch 60', true, '2026-05-28 16:06:56.346767', 48, 2114);
INSERT INTO public.lab_package_branches VALUES (2021, 23, 61, 132, 1299, '48 HR', true, '48% OFF', 'Standard package offered by branch 61', true, '2026-05-28 16:06:56.348047', 48, 2499);
INSERT INTO public.lab_package_branches VALUES (2022, 24, 62, 132, 1499, '24 HR', true, '48% OFF', 'Standard package offered by branch 62', true, '2026-05-28 16:06:56.349335', 48, 2883);
INSERT INTO public.lab_package_branches VALUES (2023, 24, 63, 132, 1199, '48 HR', true, '48% OFF', 'Standard package offered by branch 63', true, '2026-05-28 16:06:56.352634', 48, 2306);
INSERT INTO public.lab_package_branches VALUES (2024, 24, 64, 132, 1399, '24 HR', true, '48% OFF', 'Standard package offered by branch 64', true, '2026-05-28 16:06:56.354094', 48, 2691);
INSERT INTO public.lab_package_branches VALUES (2025, 25, 65, 132, 1099, '48 HR', true, '48% OFF', 'Standard package offered by branch 65', true, '2026-05-28 16:06:56.355232', 48, 2114);
INSERT INTO public.lab_package_branches VALUES (2026, 25, 66, 132, 1299, '24 HR', true, '48% OFF', 'Standard package offered by branch 66', true, '2026-05-28 16:06:56.356556', 48, 2499);
INSERT INTO public.lab_package_branches VALUES (2027, 25, 67, 132, 1499, '48 HR', true, '48% OFF', 'Standard package offered by branch 67', true, '2026-05-28 16:06:56.358058', 48, 2883);
INSERT INTO public.lab_package_branches VALUES (2028, 26, 68, 132, 1199, '24 HR', true, '48% OFF', 'Standard package offered by branch 68', true, '2026-05-28 16:06:56.359386', 48, 2306);
INSERT INTO public.lab_package_branches VALUES (2029, 26, 69, 132, 1399, '48 HR', true, '48% OFF', 'Standard package offered by branch 69', true, '2026-05-28 16:06:56.361279', 48, 2691);
INSERT INTO public.lab_package_branches VALUES (2030, 26, 70, 132, 1099, '24 HR', true, '48% OFF', 'Standard package offered by branch 70', true, '2026-05-28 16:06:56.363013', 48, 2114);
INSERT INTO public.lab_package_branches VALUES (2031, 27, 71, 132, 1299, '48 HR', true, '48% OFF', 'Standard package offered by branch 71', true, '2026-05-28 16:06:56.364513', 48, 2499);
INSERT INTO public.lab_package_branches VALUES (2032, 27, 72, 132, 1499, '24 HR', true, '48% OFF', 'Standard package offered by branch 72', true, '2026-05-28 16:06:56.366181', 48, 2883);
INSERT INTO public.lab_package_branches VALUES (2033, 27, 73, 132, 1199, '48 HR', true, '48% OFF', 'Standard package offered by branch 73', true, '2026-05-28 16:06:56.368486', 48, 2306);
INSERT INTO public.lab_package_branches VALUES (2034, 28, 74, 132, 1399, '24 HR', true, '48% OFF', 'Standard package offered by branch 74', true, '2026-05-28 16:06:56.369979', 48, 2691);
INSERT INTO public.lab_package_branches VALUES (2035, 29, 75, 132, 1099, '48 HR', true, '48% OFF', 'Standard package offered by branch 75', true, '2026-05-28 16:06:56.371528', 48, 2114);
INSERT INTO public.lab_package_branches VALUES (2036, 29, 76, 132, 1299, '24 HR', true, '48% OFF', 'Standard package offered by branch 76', true, '2026-05-28 16:06:56.373292', 48, 2499);
INSERT INTO public.lab_package_branches VALUES (2037, 29, 77, 132, 1499, '48 HR', true, '48% OFF', 'Standard package offered by branch 77', true, '2026-05-28 16:06:56.374994', 48, 2883);
INSERT INTO public.lab_package_branches VALUES (2038, 29, 78, 132, 1199, '24 HR', true, '48% OFF', 'Standard package offered by branch 78', true, '2026-05-28 16:06:56.378828', 48, 2306);
INSERT INTO public.lab_package_branches VALUES (2039, 30, 79, 132, 1399, '48 HR', true, '48% OFF', 'Standard package offered by branch 79', true, '2026-05-28 16:06:56.380909', 48, 2691);
INSERT INTO public.lab_package_branches VALUES (2040, 30, 80, 132, 1099, '24 HR', true, '48% OFF', 'Standard package offered by branch 80', true, '2026-05-28 16:06:56.382527', 48, 2114);
INSERT INTO public.lab_package_branches VALUES (2041, 30, 81, 132, 1299, '48 HR', true, '48% OFF', 'Standard package offered by branch 81', true, '2026-05-28 16:06:56.38407', 48, 2499);
INSERT INTO public.lab_package_branches VALUES (2042, 30, 82, 132, 1499, '24 HR', true, '48% OFF', 'Standard package offered by branch 82', true, '2026-05-28 16:06:56.385987', 48, 2883);
INSERT INTO public.lab_package_branches VALUES (2043, 31, 83, 132, 1199, '48 HR', true, '48% OFF', 'Standard package offered by branch 83', true, '2026-05-28 16:06:56.387767', 48, 2306);
INSERT INTO public.lab_package_branches VALUES (2044, 1, 1, 3, 1499, '48 HR', true, '25% OFF', 'Standard package offered by branch 1', true, '2026-05-28 16:06:56.390405', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (2045, 1, 2, 3, 1699, '24 HR', true, '25% OFF', 'Standard package offered by branch 2', true, '2026-05-28 16:06:56.395555', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (2047, 1, 4, 3, 1599, '24 HR', true, '25% OFF', 'Standard package offered by branch 4', true, '2026-05-28 16:06:56.398562', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (2049, 3, 6, 3, 1499, '24 HR', true, '25% OFF', 'Standard package offered by branch 6', true, '2026-05-28 16:06:56.4031', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (2050, 3, 7, 3, 1699, '48 HR', true, '25% OFF', 'Standard package offered by branch 7', true, '2026-05-28 16:06:56.406705', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (2052, 3, 9, 3, 1599, '48 HR', true, '25% OFF', 'Standard package offered by branch 9', true, '2026-05-28 16:06:56.410742', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (2053, 4, 10, 3, 1299, '24 HR', true, '25% OFF', 'Standard package offered by branch 10', true, '2026-05-28 16:06:56.412297', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (2054, 4, 11, 3, 1499, '48 HR', true, '25% OFF', 'Standard package offered by branch 11', true, '2026-05-28 16:06:56.413596', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (2055, 4, 12, 3, 1699, '24 HR', true, '25% OFF', 'Standard package offered by branch 12', true, '2026-05-28 16:06:56.414645', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (2056, 4, 13, 3, 1399, '48 HR', true, '25% OFF', 'Standard package offered by branch 13', true, '2026-05-28 16:06:56.41562', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (1992, 13, 32, 132, 1499, '24 HR', true, '48% OFF', 'Standard package offered by branch 32', true, '2026-05-28 16:06:56.298493', 48, 2883);
INSERT INTO public.lab_package_branches VALUES (1993, 14, 33, 132, 1199, '48 HR', true, '48% OFF', 'Standard package offered by branch 33', true, '2026-05-28 16:06:56.299533', 48, 2306);
INSERT INTO public.lab_package_branches VALUES (1994, 14, 34, 132, 1399, '24 HR', true, '48% OFF', 'Standard package offered by branch 34', true, '2026-05-28 16:06:56.300839', 48, 2691);
INSERT INTO public.lab_package_branches VALUES (1995, 14, 35, 132, 1099, '48 HR', true, '48% OFF', 'Standard package offered by branch 35', true, '2026-05-28 16:06:56.302406', 48, 2114);
INSERT INTO public.lab_package_branches VALUES (2048, 2, 5, 3, 1299, '48 HR', true, '25% OFF', 'Standard package offered by branch 5', true, '2026-05-28 16:06:56.400816', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (2062, 6, 19, 3, 1599, '48 HR', true, '25% OFF', 'Standard package offered by branch 19', true, '2026-05-28 16:06:56.422351', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (2063, 7, 20, 3, 1299, '24 HR', true, '25% OFF', 'Standard package offered by branch 20', true, '2026-05-28 16:06:56.423715', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (2064, 8, 21, 3, 1499, '48 HR', true, '25% OFF', 'Standard package offered by branch 21', true, '2026-05-28 16:06:56.425165', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (2065, 8, 22, 3, 1699, '24 HR', true, '25% OFF', 'Standard package offered by branch 22', true, '2026-05-28 16:06:56.429934', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (2066, 8, 23, 3, 1399, '48 HR', true, '25% OFF', 'Standard package offered by branch 23', true, '2026-05-28 16:06:56.433903', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (2067, 9, 24, 3, 1599, '24 HR', true, '25% OFF', 'Standard package offered by branch 24', true, '2026-05-28 16:06:56.436855', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (2068, 10, 25, 3, 1299, '48 HR', true, '25% OFF', 'Standard package offered by branch 25', true, '2026-05-28 16:06:56.441198', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (2069, 10, 26, 3, 1499, '24 HR', true, '25% OFF', 'Standard package offered by branch 26', true, '2026-05-28 16:06:56.44464', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (2070, 10, 27, 3, 1699, '48 HR', true, '25% OFF', 'Standard package offered by branch 27', true, '2026-05-28 16:06:56.448217', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (2071, 11, 28, 3, 1399, '24 HR', true, '25% OFF', 'Standard package offered by branch 28', true, '2026-05-28 16:06:56.451487', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (2072, 12, 29, 3, 1599, '48 HR', true, '25% OFF', 'Standard package offered by branch 29', true, '2026-05-28 16:06:56.454546', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (2073, 12, 30, 3, 1299, '24 HR', true, '25% OFF', 'Standard package offered by branch 30', true, '2026-05-28 16:06:56.45734', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (2074, 12, 31, 3, 1499, '48 HR', true, '25% OFF', 'Standard package offered by branch 31', true, '2026-05-28 16:06:56.459242', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (2075, 13, 32, 3, 1699, '24 HR', true, '25% OFF', 'Standard package offered by branch 32', true, '2026-05-28 16:06:56.461008', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (2076, 14, 33, 3, 1399, '48 HR', true, '25% OFF', 'Standard package offered by branch 33', true, '2026-05-28 16:06:56.462592', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (2077, 14, 34, 3, 1599, '24 HR', true, '25% OFF', 'Standard package offered by branch 34', true, '2026-05-28 16:06:56.463952', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (2078, 14, 35, 3, 1299, '48 HR', true, '25% OFF', 'Standard package offered by branch 35', true, '2026-05-28 16:06:56.465696', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (2079, 14, 36, 3, 1499, '24 HR', true, '25% OFF', 'Standard package offered by branch 36', true, '2026-05-28 16:06:56.467021', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (2080, 15, 37, 3, 1699, '48 HR', true, '25% OFF', 'Standard package offered by branch 37', true, '2026-05-28 16:06:56.468438', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (2081, 16, 38, 3, 1399, '24 HR', true, '25% OFF', 'Standard package offered by branch 38', true, '2026-05-28 16:06:56.47003', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (2082, 16, 39, 3, 1599, '48 HR', true, '25% OFF', 'Standard package offered by branch 39', true, '2026-05-28 16:06:56.471308', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (2083, 16, 40, 3, 1299, '24 HR', true, '25% OFF', 'Standard package offered by branch 40', true, '2026-05-28 16:06:56.472665', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (2084, 16, 41, 3, 1499, '48 HR', true, '25% OFF', 'Standard package offered by branch 41', true, '2026-05-28 16:06:56.474858', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (2086, 17, 43, 3, 1399, '48 HR', true, '25% OFF', 'Standard package offered by branch 43', true, '2026-05-28 16:06:56.480049', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (2087, 17, 44, 3, 1599, '24 HR', true, '25% OFF', 'Standard package offered by branch 44', true, '2026-05-28 16:06:56.481853', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (2088, 17, 45, 3, 1299, '48 HR', true, '25% OFF', 'Standard package offered by branch 45', true, '2026-05-28 16:06:56.483373', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (2089, 17, 46, 3, 1499, '24 HR', true, '25% OFF', 'Standard package offered by branch 46', true, '2026-05-28 16:06:56.484707', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (2090, 18, 47, 3, 1699, '48 HR', true, '25% OFF', 'Standard package offered by branch 47', true, '2026-05-28 16:06:56.486194', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (2091, 18, 48, 3, 1399, '24 HR', true, '25% OFF', 'Standard package offered by branch 48', true, '2026-05-28 16:06:56.487601', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (2092, 18, 49, 3, 1599, '48 HR', true, '25% OFF', 'Standard package offered by branch 49', true, '2026-05-28 16:06:56.48919', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (2093, 18, 50, 3, 1299, '24 HR', true, '25% OFF', 'Standard package offered by branch 50', true, '2026-05-28 16:06:56.490977', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (2094, 19, 51, 3, 1499, '48 HR', true, '25% OFF', 'Standard package offered by branch 51', true, '2026-05-28 16:06:56.492512', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (2095, 20, 52, 3, 1699, '24 HR', true, '25% OFF', 'Standard package offered by branch 52', true, '2026-05-28 16:06:56.494278', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (2096, 20, 53, 3, 1399, '48 HR', true, '25% OFF', 'Standard package offered by branch 53', true, '2026-05-28 16:06:56.496398', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (2097, 20, 54, 3, 1599, '24 HR', true, '25% OFF', 'Standard package offered by branch 54', true, '2026-05-28 16:06:56.499076', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (2098, 20, 55, 3, 1299, '48 HR', true, '25% OFF', 'Standard package offered by branch 55', true, '2026-05-28 16:06:56.501021', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (2099, 21, 56, 3, 1499, '24 HR', true, '25% OFF', 'Standard package offered by branch 56', true, '2026-05-28 16:06:56.502971', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (2100, 21, 57, 3, 1699, '48 HR', true, '25% OFF', 'Standard package offered by branch 57', true, '2026-05-28 16:06:56.50446', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (2102, 22, 59, 3, 1599, '48 HR', true, '25% OFF', 'Standard package offered by branch 59', true, '2026-05-28 16:06:56.50736', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (2103, 22, 60, 3, 1299, '24 HR', true, '25% OFF', 'Standard package offered by branch 60', true, '2026-05-28 16:06:56.508919', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (2104, 23, 61, 3, 1499, '48 HR', true, '25% OFF', 'Standard package offered by branch 61', true, '2026-05-28 16:06:56.510758', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (2105, 24, 62, 3, 1699, '24 HR', true, '25% OFF', 'Standard package offered by branch 62', true, '2026-05-28 16:06:56.512361', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (2106, 24, 63, 3, 1399, '48 HR', true, '25% OFF', 'Standard package offered by branch 63', true, '2026-05-28 16:06:56.513868', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (2107, 24, 64, 3, 1599, '24 HR', true, '25% OFF', 'Standard package offered by branch 64', true, '2026-05-28 16:06:56.515137', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (2108, 25, 65, 3, 1299, '48 HR', true, '25% OFF', 'Standard package offered by branch 65', true, '2026-05-28 16:06:56.51646', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (2109, 25, 66, 3, 1499, '24 HR', true, '25% OFF', 'Standard package offered by branch 66', true, '2026-05-28 16:06:56.517773', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (2110, 25, 67, 3, 1699, '48 HR', true, '25% OFF', 'Standard package offered by branch 67', true, '2026-05-28 16:06:56.518912', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (2111, 26, 68, 3, 1399, '24 HR', true, '25% OFF', 'Standard package offered by branch 68', true, '2026-05-28 16:06:56.51996', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (2112, 26, 69, 3, 1599, '48 HR', true, '25% OFF', 'Standard package offered by branch 69', true, '2026-05-28 16:06:56.521033', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (2113, 26, 70, 3, 1299, '24 HR', true, '25% OFF', 'Standard package offered by branch 70', true, '2026-05-28 16:06:56.522019', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (2114, 27, 71, 3, 1499, '48 HR', true, '25% OFF', 'Standard package offered by branch 71', true, '2026-05-28 16:06:56.523157', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (2116, 27, 73, 3, 1399, '48 HR', true, '25% OFF', 'Standard package offered by branch 73', true, '2026-05-28 16:06:56.525712', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (2117, 28, 74, 3, 1599, '24 HR', true, '25% OFF', 'Standard package offered by branch 74', true, '2026-05-28 16:06:56.52676', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (2119, 29, 76, 3, 1499, '24 HR', true, '25% OFF', 'Standard package offered by branch 76', true, '2026-05-28 16:06:56.52915', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (2120, 29, 77, 3, 1699, '48 HR', true, '25% OFF', 'Standard package offered by branch 77', true, '2026-05-28 16:06:56.530474', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (2121, 29, 78, 3, 1399, '24 HR', true, '25% OFF', 'Standard package offered by branch 78', true, '2026-05-28 16:06:56.531539', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (2122, 30, 79, 3, 1599, '48 HR', true, '25% OFF', 'Standard package offered by branch 79', true, '2026-05-28 16:06:56.532665', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (2123, 30, 80, 3, 1299, '24 HR', true, '25% OFF', 'Standard package offered by branch 80', true, '2026-05-28 16:06:56.534238', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (2058, 5, 15, 3, 1299, '48 HR', true, '25% OFF', 'Standard package offered by branch 15', true, '2026-05-28 16:06:56.417907', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (2059, 6, 16, 3, 1499, '24 HR', true, '25% OFF', 'Standard package offered by branch 16', true, '2026-05-28 16:06:56.419005', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (2060, 6, 17, 3, 1699, '48 HR', true, '25% OFF', 'Standard package offered by branch 17', true, '2026-05-28 16:06:56.420138', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (2061, 6, 18, 3, 1399, '24 HR', true, '25% OFF', 'Standard package offered by branch 18', true, '2026-05-28 16:06:56.421211', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (2134, 3, 8, 2, 1399, '24 HR', true, '25% OFF', 'Standard package offered by branch 8', true, '2026-05-28 16:06:56.548671', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (2135, 3, 9, 2, 1599, '48 HR', true, '25% OFF', 'Standard package offered by branch 9', true, '2026-05-28 16:06:56.550062', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (2136, 4, 10, 2, 1299, '24 HR', true, '25% OFF', 'Standard package offered by branch 10', true, '2026-05-28 16:06:56.551278', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (2137, 4, 11, 2, 1499, '48 HR', true, '25% OFF', 'Standard package offered by branch 11', true, '2026-05-28 16:06:56.552492', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (2138, 4, 12, 2, 1699, '24 HR', true, '25% OFF', 'Standard package offered by branch 12', true, '2026-05-28 16:06:56.55371', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (2139, 4, 13, 2, 1399, '48 HR', true, '25% OFF', 'Standard package offered by branch 13', true, '2026-05-28 16:06:56.555006', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (2140, 4, 14, 2, 1599, '24 HR', true, '25% OFF', 'Standard package offered by branch 14', true, '2026-05-28 16:06:56.556347', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (2141, 5, 15, 2, 1299, '48 HR', true, '25% OFF', 'Standard package offered by branch 15', true, '2026-05-28 16:06:56.557963', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (2142, 6, 16, 2, 1499, '24 HR', true, '25% OFF', 'Standard package offered by branch 16', true, '2026-05-28 16:06:56.559273', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (2143, 6, 17, 2, 1699, '48 HR', true, '25% OFF', 'Standard package offered by branch 17', true, '2026-05-28 16:06:56.560824', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (2144, 6, 18, 2, 1399, '24 HR', true, '25% OFF', 'Standard package offered by branch 18', true, '2026-05-28 16:06:56.562598', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (2145, 6, 19, 2, 1599, '48 HR', true, '25% OFF', 'Standard package offered by branch 19', true, '2026-05-28 16:06:56.564886', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (2146, 7, 20, 2, 1299, '24 HR', true, '25% OFF', 'Standard package offered by branch 20', true, '2026-05-28 16:06:56.566331', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (2147, 8, 21, 2, 1499, '48 HR', true, '25% OFF', 'Standard package offered by branch 21', true, '2026-05-28 16:06:56.567661', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (2149, 8, 23, 2, 1399, '48 HR', true, '25% OFF', 'Standard package offered by branch 23', true, '2026-05-28 16:06:56.571406', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (2150, 9, 24, 2, 1599, '24 HR', true, '25% OFF', 'Standard package offered by branch 24', true, '2026-05-28 16:06:56.572856', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (2151, 10, 25, 2, 1299, '48 HR', true, '25% OFF', 'Standard package offered by branch 25', true, '2026-05-28 16:06:56.574463', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (2152, 10, 26, 2, 1499, '24 HR', true, '25% OFF', 'Standard package offered by branch 26', true, '2026-05-28 16:06:56.575704', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (2153, 10, 27, 2, 1699, '48 HR', true, '25% OFF', 'Standard package offered by branch 27', true, '2026-05-28 16:06:56.577053', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (2154, 11, 28, 2, 1399, '24 HR', true, '25% OFF', 'Standard package offered by branch 28', true, '2026-05-28 16:06:56.57869', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (2155, 12, 29, 2, 1599, '48 HR', true, '25% OFF', 'Standard package offered by branch 29', true, '2026-05-28 16:06:56.579973', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (2156, 12, 30, 2, 1299, '24 HR', true, '25% OFF', 'Standard package offered by branch 30', true, '2026-05-28 16:06:56.581342', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (2157, 12, 31, 2, 1499, '48 HR', true, '25% OFF', 'Standard package offered by branch 31', true, '2026-05-28 16:06:56.582661', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (2159, 14, 33, 2, 1399, '48 HR', true, '25% OFF', 'Standard package offered by branch 33', true, '2026-05-28 16:06:56.585385', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (2160, 14, 34, 2, 1599, '24 HR', true, '25% OFF', 'Standard package offered by branch 34', true, '2026-05-28 16:06:56.586836', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (2161, 14, 35, 2, 1299, '48 HR', true, '25% OFF', 'Standard package offered by branch 35', true, '2026-05-28 16:06:56.588792', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (2162, 14, 36, 2, 1499, '24 HR', true, '25% OFF', 'Standard package offered by branch 36', true, '2026-05-28 16:06:56.590933', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (2163, 15, 37, 2, 1699, '48 HR', true, '25% OFF', 'Standard package offered by branch 37', true, '2026-05-28 16:06:56.592623', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (2164, 16, 38, 2, 1399, '24 HR', true, '25% OFF', 'Standard package offered by branch 38', true, '2026-05-28 16:06:56.594101', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (2166, 16, 40, 2, 1299, '24 HR', true, '25% OFF', 'Standard package offered by branch 40', true, '2026-05-28 16:06:56.596394', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (2167, 16, 41, 2, 1499, '48 HR', true, '25% OFF', 'Standard package offered by branch 41', true, '2026-05-28 16:06:56.597606', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (2168, 17, 42, 2, 1699, '24 HR', true, '25% OFF', 'Standard package offered by branch 42', true, '2026-05-28 16:06:56.598552', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (2169, 17, 43, 2, 1399, '48 HR', true, '25% OFF', 'Standard package offered by branch 43', true, '2026-05-28 16:06:56.59964', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (2170, 17, 44, 2, 1599, '24 HR', true, '25% OFF', 'Standard package offered by branch 44', true, '2026-05-28 16:06:56.600959', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (2171, 17, 45, 2, 1299, '48 HR', true, '25% OFF', 'Standard package offered by branch 45', true, '2026-05-28 16:06:56.602175', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (2172, 17, 46, 2, 1499, '24 HR', true, '25% OFF', 'Standard package offered by branch 46', true, '2026-05-28 16:06:56.603445', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (2173, 18, 47, 2, 1699, '48 HR', true, '25% OFF', 'Standard package offered by branch 47', true, '2026-05-28 16:06:56.60458', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (2174, 18, 48, 2, 1399, '24 HR', true, '25% OFF', 'Standard package offered by branch 48', true, '2026-05-28 16:06:56.605597', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (2175, 18, 49, 2, 1599, '48 HR', true, '25% OFF', 'Standard package offered by branch 49', true, '2026-05-28 16:06:56.606447', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (2177, 19, 51, 2, 1499, '48 HR', true, '25% OFF', 'Standard package offered by branch 51', true, '2026-05-28 16:06:56.60903', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (2178, 20, 52, 2, 1699, '24 HR', true, '25% OFF', 'Standard package offered by branch 52', true, '2026-05-28 16:06:56.610084', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (2179, 20, 53, 2, 1399, '48 HR', true, '25% OFF', 'Standard package offered by branch 53', true, '2026-05-28 16:06:56.611291', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (2180, 20, 54, 2, 1599, '24 HR', true, '25% OFF', 'Standard package offered by branch 54', true, '2026-05-28 16:06:56.612312', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (2181, 20, 55, 2, 1299, '48 HR', true, '25% OFF', 'Standard package offered by branch 55', true, '2026-05-28 16:06:56.613232', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (2182, 21, 56, 2, 1499, '24 HR', true, '25% OFF', 'Standard package offered by branch 56', true, '2026-05-28 16:06:56.614157', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (2183, 21, 57, 2, 1699, '48 HR', true, '25% OFF', 'Standard package offered by branch 57', true, '2026-05-28 16:06:56.615737', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (2184, 22, 58, 2, 1399, '24 HR', true, '25% OFF', 'Standard package offered by branch 58', true, '2026-05-28 16:06:56.616765', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (2185, 22, 59, 2, 1599, '48 HR', true, '25% OFF', 'Standard package offered by branch 59', true, '2026-05-28 16:06:56.617859', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (2186, 22, 60, 2, 1299, '24 HR', true, '25% OFF', 'Standard package offered by branch 60', true, '2026-05-28 16:06:56.618859', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (2187, 23, 61, 2, 1499, '48 HR', true, '25% OFF', 'Standard package offered by branch 61', true, '2026-05-28 16:06:56.619866', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (2188, 24, 62, 2, 1699, '24 HR', true, '25% OFF', 'Standard package offered by branch 62', true, '2026-05-28 16:06:56.620738', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (2189, 24, 63, 2, 1399, '48 HR', true, '25% OFF', 'Standard package offered by branch 63', true, '2026-05-28 16:06:56.621566', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (2190, 24, 64, 2, 1599, '24 HR', true, '25% OFF', 'Standard package offered by branch 64', true, '2026-05-28 16:06:56.622562', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (2192, 25, 66, 2, 1499, '24 HR', true, '25% OFF', 'Standard package offered by branch 66', true, '2026-05-28 16:06:56.624434', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (2193, 25, 67, 2, 1699, '48 HR', true, '25% OFF', 'Standard package offered by branch 67', true, '2026-05-28 16:06:56.625451', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (2194, 26, 68, 2, 1399, '24 HR', true, '25% OFF', 'Standard package offered by branch 68', true, '2026-05-28 16:06:56.62739', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (2195, 26, 69, 2, 1599, '48 HR', true, '25% OFF', 'Standard package offered by branch 69', true, '2026-05-28 16:06:56.628848', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (2196, 26, 70, 2, 1299, '24 HR', true, '25% OFF', 'Standard package offered by branch 70', true, '2026-05-28 16:06:56.630425', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (2125, 30, 82, 3, 1699, '24 HR', true, '25% OFF', 'Standard package offered by branch 82', true, '2026-05-28 16:06:56.537641', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (2126, 31, 83, 3, 1399, '48 HR', true, '25% OFF', 'Standard package offered by branch 83', true, '2026-05-28 16:06:56.53879', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (2132, 3, 6, 2, 1499, '24 HR', true, '25% OFF', 'Standard package offered by branch 6', true, '2026-05-28 16:06:56.546176', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (2133, 3, 7, 2, 1699, '48 HR', true, '25% OFF', 'Standard package offered by branch 7', true, '2026-05-28 16:06:56.547547', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (2202, 29, 76, 2, 1499, '24 HR', true, '25% OFF', 'Standard package offered by branch 76', true, '2026-05-28 16:06:56.640083', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (2203, 29, 77, 2, 1699, '48 HR', true, '25% OFF', 'Standard package offered by branch 77', true, '2026-05-28 16:06:56.642083', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (2204, 29, 78, 2, 1399, '24 HR', true, '25% OFF', 'Standard package offered by branch 78', true, '2026-05-28 16:06:56.643381', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (2206, 30, 80, 2, 1299, '24 HR', true, '25% OFF', 'Standard package offered by branch 80', true, '2026-05-28 16:06:56.646172', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (2207, 30, 81, 2, 1499, '48 HR', true, '25% OFF', 'Standard package offered by branch 81', true, '2026-05-28 16:06:56.647704', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (2208, 30, 82, 2, 1699, '24 HR', true, '25% OFF', 'Standard package offered by branch 82', true, '2026-05-28 16:06:56.649405', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (2209, 31, 83, 2, 1399, '48 HR', true, '25% OFF', 'Standard package offered by branch 83', true, '2026-05-28 16:06:56.651169', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (1991, 12, 31, 132, 1299, '48 HR', true, '48% OFF', 'Standard package offered by branch 31', true, '2026-05-28 16:06:56.297063', 48, 2499);
INSERT INTO public.lab_package_branches VALUES (2019, 22, 59, 132, 1399, '48 HR', true, '48% OFF', 'Standard package offered by branch 59', true, '2026-05-28 16:06:56.345366', 48, 2691);
INSERT INTO public.lab_package_branches VALUES (2198, 27, 72, 2, 1699, '24 HR', true, '25% OFF', 'Standard package offered by branch 72', true, '2026-05-28 16:06:56.634074', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (719, 1, 4, 117, 3099, '24 HR', true, '25% OFF', 'Standard package offered by branch 4', true, '2026-05-28 16:06:54.07975', 25, 4132);
INSERT INTO public.lab_package_branches VALUES (750, 14, 35, 117, 2799, '48 HR', true, '25% OFF', 'Standard package offered by branch 35', true, '2026-05-28 16:06:54.135907', 25, 3732);
INSERT INTO public.lab_package_branches VALUES (1109, 24, 62, 121, 2199, '24 HR', true, '20% OFF', 'Standard package offered by branch 62', true, '2026-05-28 16:06:54.842738', 20, 2749);
INSERT INTO public.lab_package_branches VALUES (784, 26, 69, 117, 3099, '48 HR', true, '25% OFF', 'Standard package offered by branch 69', true, '2026-05-28 16:06:54.203811', 25, 4132);
INSERT INTO public.lab_package_branches VALUES (1239, 10, 26, 123, 999, '24 HR', true, '23% OFF', 'Standard package offered by branch 26', true, '2026-05-28 16:06:55.077649', 23, 1298);
INSERT INTO public.lab_package_branches VALUES (1146, 6, 16, 122, 999, '24 HR', true, '23% OFF', 'Standard package offered by branch 16', true, '2026-05-28 16:06:54.908342', 23, 1298);
INSERT INTO public.lab_package_branches VALUES (691, 22, 59, 116, 3099, '48 HR', true, '25% OFF', 'Standard package offered by branch 59', true, '2026-05-28 16:06:54.021821', 25, 4132);
INSERT INTO public.lab_package_branches VALUES (1044, 30, 80, 120, 1799, '24 HR', true, '20% OFF', 'Standard package offered by branch 80', true, '2026-05-28 16:06:54.73034', 20, 2249);
INSERT INTO public.lab_package_branches VALUES (1075, 11, 28, 121, 1899, '24 HR', true, '20% OFF', 'Standard package offered by branch 28', true, '2026-05-28 16:06:54.786892', 20, 2374);
INSERT INTO public.lab_package_branches VALUES (1081, 14, 34, 121, 2099, '24 HR', true, '20% OFF', 'Standard package offered by branch 34', true, '2026-05-28 16:06:54.797905', 20, 2624);
INSERT INTO public.lab_package_branches VALUES (1499, 15, 37, 126, 2699, '48 HR', true, '16% OFF', 'Standard package offered by branch 37', true, '2026-05-28 16:06:55.530316', 16, 3214);
INSERT INTO public.lab_package_branches VALUES (1140, 4, 10, 122, 799, '24 HR', true, '23% OFF', 'Standard package offered by branch 10', true, '2026-05-28 16:06:54.898818', 23, 1038);
INSERT INTO public.lab_package_branches VALUES (1471, 3, 9, 126, 2599, '48 HR', true, '16% OFF', 'Standard package offered by branch 9', true, '2026-05-28 16:06:55.470373', 16, 3095);
INSERT INTO public.lab_package_branches VALUES (1205, 29, 75, 122, 799, '48 HR', true, '23% OFF', 'Standard package offered by branch 75', true, '2026-05-28 16:06:55.014', 23, 1038);
INSERT INTO public.lab_package_branches VALUES (1211, 30, 81, 122, 999, '48 HR', true, '23% OFF', 'Standard package offered by branch 81', true, '2026-05-28 16:06:55.028061', 23, 1298);
INSERT INTO public.lab_package_branches VALUES (1463, 1, 1, 126, 2499, '48 HR', true, '16% OFF', 'Standard package offered by branch 1', true, '2026-05-28 16:06:55.456926', 16, 2975);
INSERT INTO public.lab_package_branches VALUES (1270, 21, 57, 123, 1199, '48 HR', true, '23% OFF', 'Standard package offered by branch 57', true, '2026-05-28 16:06:55.120367', 23, 1558);
INSERT INTO public.lab_package_branches VALUES (1276, 24, 63, 123, 899, '48 HR', true, '23% OFF', 'Standard package offered by branch 63', true, '2026-05-28 16:06:55.129713', 23, 1168);
INSERT INTO public.lab_package_branches VALUES (1304, 3, 8, 124, 1399, '24 HR', true, '25% OFF', 'Standard package offered by branch 8', true, '2026-05-28 16:06:55.172695', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (1335, 16, 39, 124, 1599, '48 HR', true, '25% OFF', 'Standard package offered by branch 39', true, '2026-05-28 16:06:55.220309', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (1341, 17, 45, 124, 1299, '48 HR', true, '25% OFF', 'Standard package offered by branch 45', true, '2026-05-28 16:06:55.230285', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (1369, 27, 73, 124, 1399, '48 HR', true, '25% OFF', 'Standard package offered by branch 73', true, '2026-05-28 16:06:55.277644', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (882, 1, 1, 119, 1999, '48 HR', true, '20% OFF', 'Standard package offered by branch 1', true, '2026-05-28 16:06:54.370813', 20, 2499);
INSERT INTO public.lab_package_branches VALUES (886, 2, 5, 119, 1799, '48 HR', true, '20% OFF', 'Standard package offered by branch 5', true, '2026-05-28 16:06:54.376783', 20, 2249);
INSERT INTO public.lab_package_branches VALUES (914, 14, 33, 119, 1899, '48 HR', true, '20% OFF', 'Standard package offered by branch 33', true, '2026-05-28 16:06:54.495076', 20, 2374);
INSERT INTO public.lab_package_branches VALUES (945, 24, 64, 119, 2099, '24 HR', true, '20% OFF', 'Standard package offered by branch 64', true, '2026-05-28 16:06:54.550723', 20, 2624);
INSERT INTO public.lab_package_branches VALUES (951, 26, 70, 119, 1799, '24 HR', true, '20% OFF', 'Standard package offered by branch 70', true, '2026-05-28 16:06:54.560557', 20, 2249);
INSERT INTO public.lab_package_branches VALUES (979, 5, 15, 120, 1799, '48 HR', true, '20% OFF', 'Standard package offered by branch 15', true, '2026-05-28 16:06:54.610632', 20, 2249);
INSERT INTO public.lab_package_branches VALUES (1010, 17, 46, 120, 1999, '24 HR', true, '20% OFF', 'Standard package offered by branch 46', true, '2026-05-28 16:06:54.677175', 20, 2499);
INSERT INTO public.lab_package_branches VALUES (1016, 20, 52, 120, 2199, '24 HR', true, '20% OFF', 'Standard package offered by branch 52', true, '2026-05-28 16:06:54.686402', 20, 2749);
INSERT INTO public.lab_package_branches VALUES (1530, 26, 68, 126, 2399, '24 HR', true, '16% OFF', 'Standard package offered by branch 68', true, '2026-05-28 16:06:55.574881', 16, 2856);
INSERT INTO public.lab_package_branches VALUES (1536, 28, 74, 126, 2599, '24 HR', true, '16% OFF', 'Standard package offered by branch 74', true, '2026-05-28 16:06:55.584024', 16, 3095);
INSERT INTO public.lab_package_branches VALUES (1725, 4, 14, 129, 499, '24 HR', true, '20% OFF', 'Standard package offered by branch 14', true, '2026-05-28 16:06:55.885324', 20, 624);
INSERT INTO public.lab_package_branches VALUES (1731, 7, 20, 129, 299, '24 HR', true, '25% OFF', 'Standard package offered by branch 20', true, '2026-05-28 16:06:55.900122', 25, 399);
INSERT INTO public.lab_package_branches VALUES (1759, 18, 48, 129, 299, '24 HR', true, '25% OFF', 'Standard package offered by branch 48', true, '2026-05-28 16:06:55.976673', 25, 399);
INSERT INTO public.lab_package_branches VALUES (1694, 25, 66, 128, 399, '24 HR', true, '20% OFF', 'Standard package offered by branch 66', true, '2026-05-28 16:06:55.834371', 20, 499);
INSERT INTO public.lab_package_branches VALUES (1796, 1, 2, 130, 1499, '24 HR', true, '48% OFF', 'Standard package offered by branch 2', true, '2026-05-28 16:06:56.023674', 48, 2883);
INSERT INTO public.lab_package_branches VALUES (1595, 18, 50, 127, 2299, '24 HR', true, '16% OFF', 'Standard package offered by branch 50', true, '2026-05-28 16:06:55.684117', 16, 2737);
INSERT INTO public.lab_package_branches VALUES (1855, 23, 61, 130, 1299, '48 HR', true, '48% OFF', 'Standard package offered by branch 61', true, '2026-05-28 16:06:56.099138', 48, 2499);
INSERT INTO public.lab_package_branches VALUES (1790, 30, 79, 129, 499, '48 HR', true, '20% OFF', 'Standard package offered by branch 79', true, '2026-05-28 16:06:56.01697', 20, 624);
INSERT INTO public.lab_package_branches VALUES (1629, 1, 1, 128, 399, '48 HR', true, '20% OFF', 'Standard package offered by branch 1', true, '2026-05-28 16:06:55.731716', 20, 499);
INSERT INTO public.lab_package_branches VALUES (1824, 12, 30, 130, 1099, '24 HR', true, '48% OFF', 'Standard package offered by branch 30', true, '2026-05-28 16:06:56.059998', 48, 2114);
INSERT INTO public.lab_package_branches VALUES (1666, 16, 38, 128, 299, '24 HR', true, '25% OFF', 'Standard package offered by branch 38', true, '2026-05-28 16:06:55.791977', 25, 399);
INSERT INTO public.lab_package_branches VALUES (1564, 6, 19, 127, 2599, '48 HR', true, '16% OFF', 'Standard package offered by branch 19', true, '2026-05-28 16:06:55.644897', 16, 3095);
INSERT INTO public.lab_package_branches VALUES (1660, 13, 32, 128, 599, '24 HR', true, '20% OFF', 'Standard package offered by branch 32', true, '2026-05-28 16:06:55.782977', 20, 749);
INSERT INTO public.lab_package_branches VALUES (1601, 21, 56, 127, 2499, '24 HR', true, '16% OFF', 'Standard package offered by branch 56', true, '2026-05-28 16:06:55.694314', 16, 2975);
INSERT INTO public.lab_package_branches VALUES (2201, 29, 75, 2, 1299, '48 HR', true, '25% OFF', 'Standard package offered by branch 75', true, '2026-05-28 16:06:56.638557', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (2199, 27, 73, 2, 1399, '48 HR', true, '25% OFF', 'Standard package offered by branch 73', true, '2026-05-28 16:06:56.63564', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (2200, 28, 74, 2, 1599, '24 HR', true, '25% OFF', 'Standard package offered by branch 74', true, '2026-05-28 16:06:56.637171', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (654, 8, 22, 116, 3199, '24 HR', true, '25% OFF', 'Standard package offered by branch 22', true, '2026-05-28 16:06:53.952198', 25, 4266);
INSERT INTO public.lab_package_branches VALUES (685, 20, 53, 116, 2899, '48 HR', true, '25% OFF', 'Standard package offered by branch 53', true, '2026-05-28 16:06:54.008154', 25, 3866);
INSERT INTO public.lab_package_branches VALUES (756, 16, 41, 117, 2999, '48 HR', true, '25% OFF', 'Standard package offered by branch 41', true, '2026-05-28 16:06:54.152609', 25, 3999);
INSERT INTO public.lab_package_branches VALUES (11, 1, 1, 1, 1499, '48 HR', true, '25% OFF', 'Standard package offered by Apollo Diagnostics', true, '2026-05-25 21:24:54.864272', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (10, 27, 71, 1, 1499, '48 HR', true, '25% OFF', 'Standard package offered by SRL Diagnostics', true, '2026-05-25 21:24:54.864272', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (2158, 13, 32, 2, 1699, '24 HR', true, '25% OFF', 'Standard package offered by branch 32', true, '2026-05-28 16:06:56.584018', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (7, 16, 39, 2, 1599, '48 HR', true, '25% OFF', 'Standard package offered by House of Diagnostics (HOD)', true, '2026-05-25 21:24:54.864272', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (2191, 25, 65, 2, 1299, '48 HR', true, '25% OFF', 'Standard package offered by branch 65', true, '2026-05-28 16:06:56.623503', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (2197, 27, 71, 2, 1499, '48 HR', true, '25% OFF', 'Standard package offered by branch 71', true, '2026-05-28 16:06:56.631994', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (12, 30, 79, 2, 1599, '48 HR', true, '25% OFF', 'Standard package offered by Thyrocare', true, '2026-05-25 21:24:54.864272', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (1174, 17, 44, 122, 1099, '24 HR', true, '23% OFF', 'Standard package offered by branch 44', true, '2026-05-28 16:06:54.955446', 23, 1428);
INSERT INTO public.lab_package_branches VALUES (1872, 29, 78, 130, 1199, '24 HR', true, '48% OFF', 'Standard package offered by branch 78', true, '2026-05-28 16:06:56.12027', 48, 2306);
INSERT INTO public.lab_package_branches VALUES (9, 1, 3, 3, 1399, '48 HR', true, '25% OFF', 'Standard package offered by Apollo Diagnostics', true, '2026-05-25 21:24:54.864272', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (2051, 3, 8, 3, 1399, '24 HR', true, '25% OFF', 'Standard package offered by branch 8', true, '2026-05-28 16:06:56.408606', 25, 1866);
INSERT INTO public.lab_package_branches VALUES (2057, 4, 14, 3, 1599, '24 HR', true, '25% OFF', 'Standard package offered by branch 14', true, '2026-05-28 16:06:56.416752', 25, 2132);
INSERT INTO public.lab_package_branches VALUES (2085, 17, 42, 3, 1699, '24 HR', true, '25% OFF', 'Standard package offered by branch 42', true, '2026-05-28 16:06:56.477621', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (2118, 29, 75, 3, 1299, '48 HR', true, '25% OFF', 'Standard package offered by branch 75', true, '2026-05-28 16:06:56.527908', 25, 1732);
INSERT INTO public.lab_package_branches VALUES (2124, 30, 81, 3, 1499, '48 HR', true, '25% OFF', 'Standard package offered by branch 81', true, '2026-05-28 16:06:56.535997', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (815, 6, 17, 118, 3199, '48 HR', true, '25% OFF', 'Standard package offered by branch 17', true, '2026-05-28 16:06:54.253113', 25, 4266);
INSERT INTO public.lab_package_branches VALUES (845, 18, 47, 118, 3199, '48 HR', true, '25% OFF', 'Standard package offered by branch 47', true, '2026-05-28 16:06:54.299714', 25, 4266);
INSERT INTO public.lab_package_branches VALUES (876, 29, 78, 118, 2899, '24 HR', true, '25% OFF', 'Standard package offered by branch 78', true, '2026-05-28 16:06:54.362806', 25, 3866);
INSERT INTO public.lab_package_branches VALUES (1400, 8, 21, 125, 1499, '48 HR', true, '25% OFF', 'Standard package offered by branch 21', true, '2026-05-28 16:06:55.330144', 25, 1999);
INSERT INTO public.lab_package_branches VALUES (1426, 18, 47, 125, 1699, '48 HR', true, '25% OFF', 'Standard package offered by branch 47', true, '2026-05-28 16:06:55.367802', 25, 2266);
INSERT INTO public.lab_package_branches VALUES (1457, 29, 78, 125, 1399, '24 HR', true, '25% OFF', 'Standard package offered by branch 78', true, '2026-05-28 16:06:55.446167', 25, 1866);


--
-- TOC entry 5191 (class 0 OID 76881)
-- Dependencies: 240
-- Data for Name: lab_profiles; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.lab_profiles VALUES (1, 1, 'World-Class Diagnostics, Apollo Standards', 'Apollo Diagnostics brings global standards to everyday diagnostics. Backed by the Apollo Hospital network, it offers a comprehensive test catalogue with strict quality control and ISO-certified lab infrastructure.', 2001, '{NABL,"ISO 15189",JCI}', 'multi-specialty', 400, 1800, '{https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80,https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=600&q=80,https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&q=80}', '{"Full Body Checkup",Cardiac,Oncology,Diabetes,"Womens Health"}', true, 12, 3.9, 637, '2026-05-28 16:06:52.893578', '2026-05-28 16:23:56.058546');
INSERT INTO public.lab_profiles VALUES (2, 3, 'Trusted Diagnostic Partner', 'A NABL-certified diagnostic laboratory delivering accurate clinical test results with a patient-first approach. Equipped with modern instruments and staffed by experienced pathologists.', 2005, '{NABL}', 'pathology', 25, 300, '{https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80,https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=600&q=80,https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&q=80}', '{"Blood Tests",Pathology,"Home Collection"}', true, 12, 4.1, 911, '2026-05-28 16:06:52.893578', '2026-05-28 16:23:56.058546');
INSERT INTO public.lab_profiles VALUES (6, 7, 'Legacy of Clinical Excellence Since 1958', 'Dr. Dang''s Lab has been Delhi''s most respected independent clinical laboratory since 1958. Known for its meticulous quality standards, it serves top hospitals, clinics, and individual patients across the NCR.', 1958, '{NABL,"ISO 15189",ILAC}', 'pathology', 12, 600, '{https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80,https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=600&q=80,https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&q=80}', '{"Clinical Pathology",Immunology,Microbiology,Hormones}', true, 6, 4.5, 1459, '2026-05-28 16:06:52.893578', '2026-05-28 16:23:56.058546');
INSERT INTO public.lab_profiles VALUES (7, 8, 'India''s Most Trusted Diagnostic Chain Since 1988', 'Dr. Lal PathLabs is India''s largest diagnostic chain with over 4,000 collection centres nationwide. Founded in 1988, the lab delivers NABL-certified, quality-assured reports with cutting-edge automation technology.', 1988, '{NABL,"ISO 15189",CAP}', 'pathology', 4000, 4000, '{https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80,https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=600&q=80,https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&q=80}', '{"Blood Tests","Genetic Testing",Microbiology,Hormones,Thyroid,"Lipid Profiles"}', true, 6, 4.6, 1596, '2026-05-28 16:06:52.893578', '2026-05-28 16:23:56.058546');
INSERT INTO public.lab_profiles VALUES (15, 17, 'Premium Imaging & Diagnostic Solutions', 'Mahajan Imaging is Delhi''s premier radiology and imaging centre, offering everything from MRI to digital X-rays with internationally trained radiologists and state-of-the-art imaging equipment.', 1982, '{NABL}', 'radiology', 25, 300, '{https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80,https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=600&q=80,https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&q=80}', '{MRI,"CT Scan",Ultrasound,X-Ray,"PET Scan"}', true, 12, 4.3, 2829, '2026-05-28 16:06:52.893578', '2026-05-28 16:23:56.058546');
INSERT INTO public.lab_profiles VALUES (16, 2, 'World-Class Diagnostics, Apollo Standards', 'Apollo Diagnostics brings global standards to everyday diagnostics. Backed by the Apollo Hospital network, it offers a comprehensive test catalogue with strict quality control and ISO-certified lab infrastructure.', 2001, '{NABL,"ISO 15189",JCI}', 'multi-specialty', 400, 1800, '{https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80,https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=600&q=80,https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&q=80}', '{"Full Body Checkup",Cardiac,Oncology,Diabetes,"Womens Health"}', true, 12, 4.0, 774, '2026-05-28 16:06:52.893578', '2026-05-28 16:23:56.058546');
INSERT INTO public.lab_profiles VALUES (17, 14, 'Diagnostics Delivered to Your Doorstep', 'Healthians disrupted diagnostics with its tech-driven home collection model. Offering 1,500+ tests with certified phlebotomist home visits, digital reports, and competitive pricing, it''s India''s top at-home lab.', 2013, '{NABL,"ISO 9001"}', 'pathology', 1200, 1500, '{https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80,https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=600&q=80,https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&q=80}', '{"Home Collection","Blood Tests","Preventive Care",Packages}', true, 8, 4.0, 2418, '2026-05-28 16:06:52.893578', '2026-05-28 16:23:56.058546');
INSERT INTO public.lab_profiles VALUES (18, 18, 'Advanced Diagnostics by Max Healthcare', 'Max Lab operates under the Max Healthcare umbrella, providing hospital-grade diagnostic accuracy in a community setting. Features state-of-the-art equipment and internationally trained pathologists.', 2000, '{NABL,NABH,JCI}', 'multi-specialty', 150, 2500, '{https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80,https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=600&q=80,https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&q=80}', '{"Blood Tests",Pathology,"Home Collection"}', true, 12, 4.4, 2966, '2026-05-28 16:06:52.893578', '2026-05-28 16:23:56.058546');
INSERT INTO public.lab_profiles VALUES (3, 4, 'Affordable Full-Service Diagnostics', 'City X-Ray & Scan Centre provides affordable X-ray, CT, MRI, and pathology services across Delhi NCR. With decades of experience, it offers accurate and fast diagnostic imaging to all communities.', 1992, '{NABL}', 'radiology', 25, 300, '{https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80,https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=600&q=80,https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&q=80}', '{X-Ray,Ultrasound,"CT Scan","Blood Tests"}', true, 12, 4.2, 1048, '2026-05-28 16:06:52.893578', '2026-05-28 16:23:56.058546');
INSERT INTO public.lab_profiles VALUES (4, 5, 'Affordable Full-Service Diagnostics', 'City X-Ray & Scan Centre provides affordable X-ray, CT, MRI, and pathology services across Delhi NCR. With decades of experience, it offers accurate and fast diagnostic imaging to all communities.', 1992, '{NABL}', 'radiology', 25, 300, '{https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80,https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=600&q=80,https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&q=80}', '{X-Ray,Ultrasound,"CT Scan","Blood Tests"}', true, 12, 4.3, 1185, '2026-05-28 16:06:52.893578', '2026-05-28 16:23:56.058546');
INSERT INTO public.lab_profiles VALUES (5, 6, 'Legacy of Clinical Excellence Since 1958', 'Dr. Dang''s Lab has been Delhi''s most respected independent clinical laboratory since 1958. Known for its meticulous quality standards, it serves top hospitals, clinics, and individual patients across the NCR.', 1958, '{NABL,"ISO 15189",ILAC}', 'pathology', 12, 600, '{https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80,https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=600&q=80,https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&q=80}', '{"Clinical Pathology",Immunology,Microbiology,Hormones}', true, 6, 4.4, 1322, '2026-05-28 16:06:52.893578', '2026-05-28 16:23:56.058546');
INSERT INTO public.lab_profiles VALUES (8, 9, 'India''s Most Trusted Diagnostic Chain Since 1988', 'Dr. Lal PathLabs is India''s largest diagnostic chain with over 4,000 collection centres nationwide. Founded in 1988, the lab delivers NABL-certified, quality-assured reports with cutting-edge automation technology.', 1988, '{NABL,"ISO 15189",CAP}', 'pathology', 4000, 4000, '{https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80,https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=600&q=80,https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&q=80}', '{"Blood Tests","Genetic Testing",Microbiology,Hormones,Thyroid,"Lipid Profiles"}', true, 6, 4.7, 1733, '2026-05-28 16:06:52.893578', '2026-05-28 16:23:56.058546');
INSERT INTO public.lab_profiles VALUES (9, 10, 'Trusted Diagnostic Partner', 'A NABL-certified diagnostic laboratory delivering accurate clinical test results with a patient-first approach. Equipped with modern instruments and staffed by experienced pathologists.', 2005, '{NABL}', 'radiology', 25, 300, '{https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80,https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=600&q=80,https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&q=80}', '{"Blood Tests",Pathology,"Home Collection"}', true, 12, 4.8, 1870, '2026-05-28 16:06:52.893578', '2026-05-28 16:23:56.058546');
INSERT INTO public.lab_profiles VALUES (10, 11, 'Trusted Diagnostic Partner', 'A NABL-certified diagnostic laboratory delivering accurate clinical test results with a patient-first approach. Equipped with modern instruments and staffed by experienced pathologists.', 2005, '{NABL}', 'pathology', 25, 300, '{https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80,https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=600&q=80,https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&q=80}', '{"Blood Tests",Pathology,"Home Collection"}', true, 12, 4.9, 2007, '2026-05-28 16:06:52.893578', '2026-05-28 16:23:56.058546');
INSERT INTO public.lab_profiles VALUES (11, 12, 'Your Neighbourhood Diagnostic Partner', 'Ganesh Diagnostic & Imaging Centre is a trusted neighbourhood lab network in Delhi NCR. Known for fast report turnaround and affordable pricing with quality NABL-certified infrastructure.', 1985, '{NABL}', 'pathology', 25, 300, '{https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80,https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=600&q=80,https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&q=80}', '{"Blood Tests",Pathology,"Home Collection"}', true, 12, 3.8, 2144, '2026-05-28 16:06:52.893578', '2026-05-28 16:23:56.058546');
INSERT INTO public.lab_profiles VALUES (12, 13, 'Your Neighbourhood Diagnostic Partner', 'Ganesh Diagnostic & Imaging Centre is a trusted neighbourhood lab network in Delhi NCR. Known for fast report turnaround and affordable pricing with quality NABL-certified infrastructure.', 1985, '{NABL}', 'pathology', 25, 300, '{https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80,https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=600&q=80,https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&q=80}', '{"Blood Tests",Pathology,"Home Collection"}', true, 12, 3.9, 2281, '2026-05-28 16:06:52.893578', '2026-05-28 16:23:56.058546');
INSERT INTO public.lab_profiles VALUES (29, 30, 'Affordable Precision Diagnostics Nationwide', 'Thyrocare Technologies pioneered affordable home collection in India. Known for its high-throughput central processing hub, it delivers accurate results at industry-leading prices with a fully automated workflow.', 1996, '{NABL,"ISO 9001"}', 'pathology', 2000, 1100, '{https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80,https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=600&q=80,https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&q=80}', '{Thyroid,Diabetes,"Blood Tests","Vitamin Profiles"}', true, 12, 4.4, 4610, '2026-05-28 16:06:52.893578', '2026-05-28 16:23:56.058546');
INSERT INTO public.lab_profiles VALUES (30, 31, 'Affordable Precision Diagnostics Nationwide', 'Thyrocare Technologies pioneered affordable home collection in India. Known for its high-throughput central processing hub, it delivers accurate results at industry-leading prices with a fully automated workflow.', 1996, '{NABL,"ISO 9001"}', 'pathology', 2000, 1100, '{https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80,https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=600&q=80,https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&q=80}', '{Thyroid,Diabetes,"Blood Tests","Vitamin Profiles"}', true, 12, 4.5, 4747, '2026-05-28 16:06:52.893578', '2026-05-28 16:23:56.058546');
INSERT INTO public.lab_profiles VALUES (31, 26, 'Trusted Diagnostic Partner', 'A NABL-certified diagnostic laboratory delivering accurate clinical test results with a patient-first approach. Equipped with modern instruments and staffed by experienced pathologists.', 2005, '{NABL}', 'pathology', 25, 300, '{https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80,https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=600&q=80,https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&q=80}', '{"Blood Tests",Pathology,"Home Collection"}', true, 12, 4.0, 4062, '2026-05-28 16:06:52.893578', '2026-05-28 16:23:56.058546');
INSERT INTO public.lab_profiles VALUES (13, 15, 'Diagnostics Delivered to Your Doorstep', 'Healthians disrupted diagnostics with its tech-driven home collection model. Offering 1,500+ tests with certified phlebotomist home visits, digital reports, and competitive pricing, it''s India''s top at-home lab.', 2013, '{NABL,"ISO 9001"}', 'pathology', 1200, 1500, '{https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80,https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=600&q=80,https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&q=80}', '{"Home Collection","Blood Tests","Preventive Care",Packages}', true, 8, 4.1, 2555, '2026-05-28 16:06:52.893578', '2026-05-28 16:23:56.058546');
INSERT INTO public.lab_profiles VALUES (14, 16, 'Trusted Diagnostic Partner', 'A NABL-certified diagnostic laboratory delivering accurate clinical test results with a patient-first approach. Equipped with modern instruments and staffed by experienced pathologists.', 2005, '{NABL}', 'pathology', 25, 300, '{https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80,https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=600&q=80,https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&q=80}', '{"Blood Tests",Pathology,"Home Collection"}', true, 12, 4.2, 2692, '2026-05-28 16:06:52.893578', '2026-05-28 16:23:56.058546');
INSERT INTO public.lab_profiles VALUES (19, 19, 'Advanced Diagnostics by Max Healthcare', 'Max Lab operates under the Max Healthcare umbrella, providing hospital-grade diagnostic accuracy in a community setting. Features state-of-the-art equipment and internationally trained pathologists.', 2000, '{NABL,NABH,JCI}', 'multi-specialty', 150, 2500, '{https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80,https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=600&q=80,https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&q=80}', '{"Blood Tests",Pathology,"Home Collection"}', true, 12, 4.5, 3103, '2026-05-28 16:06:52.893578', '2026-05-28 16:23:56.058546');
INSERT INTO public.lab_profiles VALUES (20, 20, 'Trusted Diagnostic Partner', 'A NABL-certified diagnostic laboratory delivering accurate clinical test results with a patient-first approach. Equipped with modern instruments and staffed by experienced pathologists.', 2005, '{NABL}', 'pathology', 25, 300, '{https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80,https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=600&q=80,https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&q=80}', '{"Blood Tests",Pathology,"Home Collection"}', true, 12, 4.6, 3240, '2026-05-28 16:06:52.893578', '2026-05-28 16:23:56.058546');
INSERT INTO public.lab_profiles VALUES (21, 21, 'Trusted Diagnostic Partner', 'A NABL-certified diagnostic laboratory delivering accurate clinical test results with a patient-first approach. Equipped with modern instruments and staffed by experienced pathologists.', 2005, '{NABL}', 'pathology', 25, 300, '{https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80,https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=600&q=80,https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&q=80}', '{"Blood Tests",Pathology,"Home Collection"}', true, 12, 4.7, 3377, '2026-05-28 16:06:52.893578', '2026-05-28 16:23:56.058546');
INSERT INTO public.lab_profiles VALUES (22, 22, 'Kind Care. Precise Results.', 'Pathkind Labs has built a strong network across Tier-1 and Tier-2 cities, with NABL-certified labs and a focus on personalized diagnostic care for every patient.', 2010, '{NABL}', 'pathology', 25, 300, '{https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80,https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=600&q=80,https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&q=80}', '{"Blood Tests",Pathology,"Home Collection"}', true, 12, 4.8, 3514, '2026-05-28 16:06:52.893578', '2026-05-28 16:23:56.058546');
INSERT INTO public.lab_profiles VALUES (23, 23, 'Kind Care. Precise Results.', 'Pathkind Labs has built a strong network across Tier-1 and Tier-2 cities, with NABL-certified labs and a focus on personalized diagnostic care for every patient.', 2010, '{NABL}', 'pathology', 25, 300, '{https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80,https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=600&q=80,https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&q=80}', '{"Blood Tests",Pathology,"Home Collection"}', true, 12, 4.9, 3651, '2026-05-28 16:06:52.893578', '2026-05-28 16:23:56.058546');
INSERT INTO public.lab_profiles VALUES (24, 24, 'Trusted Diagnostic Partner', 'A NABL-certified diagnostic laboratory delivering accurate clinical test results with a patient-first approach. Equipped with modern instruments and staffed by experienced pathologists.', 2005, '{NABL}', 'pathology', 25, 300, '{https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80,https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=600&q=80,https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&q=80}', '{"Blood Tests",Pathology,"Home Collection"}', true, 12, 3.8, 3788, '2026-05-28 16:06:52.893578', '2026-05-28 16:23:56.058546');
INSERT INTO public.lab_profiles VALUES (25, 25, 'Smart Diagnostics, Smarter Pricing', 'Redcliffe Labs is one of India''s fastest-growing diagnostic startups. Combining AI-driven logistics with 1,000+ test offerings, it delivers NABL-certified reports with unprecedented speed.', 2019, '{NABL,"ISO 15189"}', 'pathology', 300, 1000, '{https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80,https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=600&q=80,https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&q=80}', '{"Blood Tests",Pathology,"Home Collection"}', true, 6, 3.9, 3925, '2026-05-28 16:06:52.893578', '2026-05-28 16:23:56.058546');
INSERT INTO public.lab_profiles VALUES (26, 27, 'Scientific Rigour. Reliable Results.', 'SRL Diagnostics is one of India''s top 3 diagnostic chains with over 400 clinical labs and 5,000+ collection points. ISO 15189 certified, it serves over 70,000 patients daily with a 3,800+ test catalogue.', 1995, '{NABL,"ISO 15189",CAP}', 'pathology', 500, 3800, '{https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80,https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=600&q=80,https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&q=80}', '{"Blood Tests",Pathology,Radiology,Genetics,Toxicology}', true, 12, 4.1, 4199, '2026-05-28 16:06:52.893578', '2026-05-28 16:23:56.058546');
INSERT INTO public.lab_profiles VALUES (27, 28, 'Scientific Rigour. Reliable Results.', 'SRL Diagnostics is one of India''s top 3 diagnostic chains with over 400 clinical labs and 5,000+ collection points. ISO 15189 certified, it serves over 70,000 patients daily with a 3,800+ test catalogue.', 1995, '{NABL,"ISO 15189",CAP}', 'pathology', 500, 3800, '{https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80,https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=600&q=80,https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&q=80}', '{"Blood Tests",Pathology,Radiology,Genetics,Toxicology}', true, 12, 4.2, 4336, '2026-05-28 16:06:52.893578', '2026-05-28 16:23:56.058546');
INSERT INTO public.lab_profiles VALUES (28, 29, 'Trusted Diagnostic Partner', 'A NABL-certified diagnostic laboratory delivering accurate clinical test results with a patient-first approach. Equipped with modern instruments and staffed by experienced pathologists.', 2005, '{NABL}', 'radiology', 25, 300, '{https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80,https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=600&q=80,https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&q=80}', '{"Blood Tests",Pathology,"Home Collection"}', true, 12, 4.3, 4473, '2026-05-28 16:06:52.893578', '2026-05-28 16:23:56.058546');


--
-- TOC entry 5177 (class 0 OID 60515)
-- Dependencies: 226
-- Data for Name: lab_test_branches; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.lab_test_branches VALUES (1, 1, 1, 42, 1499, '24 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (2, 1, 1, 6, 450, '8 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (5, 1, 3, 55, 4000, '4 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (6, 1, 3, 52, 2800, '24 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (7, 1, 3, 24, 900, '8 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (9, 1, 4, 88, 436, '12 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (13, 3, 8, 133, 495, '8 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (14, 3, 9, 111, 487, '12 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (15, 3, 9, 71, 607, '12 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (18, 4, 11, 125, 375, '8 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (19, 4, 12, 95, 695, '12 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (21, 4, 13, 8, 250, '3 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (23, 5, 15, 145, 675, '8 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (25, 6, 17, 89, 473, '12 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (26, 6, 18, 109, 413, '12 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (27, 6, 18, 69, 533, '12 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (29, 6, 19, 13, 450, '6 HR', false, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (30, 6, 19, 10, 550, '6 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (34, 8, 22, 100, 880, '12 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (35, 8, 22, 60, 200, '12 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (37, 8, 22, 23, 1200, '12 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (39, 8, 22, 1, 350, '6 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (41, 8, 23, 11, 300, '4 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (42, 9, 24, 140, 600, '8 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (43, 10, 25, 38, 6000, '6 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (46, 10, 26, 92, 584, '12 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (47, 10, 27, 112, 524, '12 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (49, 11, 28, 56, 4200, '3 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (50, 12, 29, 122, 330, '8 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (51, 12, 29, 94, 658, '12 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (53, 12, 30, 74, 718, '12 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (54, 12, 30, 57, 4500, '3 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (57, 12, 31, 40, 3200, '2 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (58, 12, 31, 28, 750, '1 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (61, 14, 34, 129, 435, '8 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (62, 14, 35, 103, 991, '12 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (63, 14, 35, 63, 311, '12 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (65, 14, 36, 45, 1099, '12 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (67, 15, 37, 149, 735, '8 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (69, 16, 39, 50, 1999, '18 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (70, 16, 39, 39, 3500, '4 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (71, 16, 39, 33, 300, '1 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (74, 16, 40, 77, 829, '12 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (75, 16, 41, 131, 465, '8 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (78, 17, 43, 73, 681, '12 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (79, 17, 44, 93, 621, '12 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (81, 17, 46, 26, 1200, '2 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (82, 18, 47, 81, 977, '12 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (83, 18, 48, 58, 5000, '2 HR', false, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (85, 18, 49, 101, 917, '12 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (86, 18, 50, 123, 345, '8 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (89, 18, 50, 7, 500, '6 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (90, 19, 51, 143, 645, '8 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (91, 20, 52, 99, 843, '12 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (93, 20, 54, 59, 4800, '4 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (95, 20, 55, 119, 783, '12 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (97, 21, 56, 138, 570, '8 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (98, 21, 56, 86, 362, '12 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (102, 22, 58, 53, 2500, '24 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (103, 22, 58, 17, 400, '8 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (105, 22, 59, 116, 672, '12 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (106, 22, 59, 76, 792, '12 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (107, 22, 60, 96, 732, '12 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (109, 24, 62, 15, 280, '8 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (111, 24, 64, 132, 480, '8 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (113, 24, 64, 64, 348, '12 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (114, 25, 65, 130, 450, '8 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (117, 25, 65, 25, 699, '24 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (118, 25, 65, 5, 200, '8 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (119, 25, 66, 90, 510, '12 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (3, 1, 2, 108, 376, '12 HR', true, '2026-05-25 21:24:54.846033', 10, 418);
INSERT INTO public.lab_test_branches VALUES (10, 2, 5, 144, 660, '8 HR', true, '2026-05-25 21:24:54.846033', 10, 734);
INSERT INTO public.lab_test_branches VALUES (17, 4, 10, 75, 755, '12 HR', true, '2026-05-25 21:24:54.846033', 10, 839);
INSERT INTO public.lab_test_branches VALUES (31, 7, 20, 147, 705, '8 HR', true, '2026-05-25 21:24:54.846033', 10, 784);
INSERT INTO public.lab_test_branches VALUES (38, 8, 22, 16, 550, '12 HR', true, '2026-05-25 21:24:54.846033', 10, 612);
INSERT INTO public.lab_test_branches VALUES (45, 10, 26, 136, 540, '8 HR', true, '2026-05-25 21:24:54.846033', 10, 600);
INSERT INTO public.lab_test_branches VALUES (59, 13, 32, 142, 630, '8 HR', true, '2026-05-25 21:24:54.846033', 10, 700);
INSERT INTO public.lab_test_branches VALUES (66, 14, 36, 18, 350, '6 HR', true, '2026-05-25 21:24:54.846033', 10, 389);
INSERT INTO public.lab_test_branches VALUES (73, 16, 40, 117, 709, '12 HR', true, '2026-05-25 21:24:54.846033', 10, 788);
INSERT INTO public.lab_test_branches VALUES (87, 18, 50, 54, 3500, '2 HR', true, '2026-05-25 21:24:54.846033', 10, 3889);
INSERT INTO public.lab_test_branches VALUES (94, 20, 54, 37, 5000, '4 HR', true, '2026-05-25 21:24:54.846033', 10, 5556);
INSERT INTO public.lab_test_branches VALUES (101, 21, 57, 34, 350, '2 HR', true, '2026-05-25 21:24:54.846033', 10, 389);
INSERT INTO public.lab_test_branches VALUES (115, 25, 65, 110, 450, '12 HR', true, '2026-05-25 21:24:54.846033', 10, 500);
INSERT INTO public.lab_test_branches VALUES (11, 3, 6, 91, 547, '12 HR', true, '2026-05-25 21:24:54.846033', 20, 684);
INSERT INTO public.lab_test_branches VALUES (22, 4, 14, 27, 900, '1 HR', true, '2026-05-25 21:24:54.846033', 20, 1125);
INSERT INTO public.lab_test_branches VALUES (33, 8, 22, 120, 300, '8 HR', true, '2026-05-25 21:24:54.846033', 20, 375);
INSERT INTO public.lab_test_branches VALUES (55, 12, 30, 44, 899, '12 HR', true, '2026-05-25 21:24:54.846033', 20, 1124);
INSERT INTO public.lab_test_branches VALUES (77, 17, 43, 113, 561, '12 HR', true, '2026-05-25 21:24:54.846033', 20, 702);
INSERT INTO public.lab_test_branches VALUES (99, 21, 57, 106, 302, '12 HR', true, '2026-05-25 21:24:54.846033', 20, 378);
INSERT INTO public.lab_test_branches VALUES (110, 24, 63, 84, 288, '12 HR', true, '2026-05-25 21:24:54.846033', 20, 360);
INSERT INTO public.lab_test_branches VALUES (123, 26, 69, 134, 510, '8 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (125, 26, 70, 32, 400, '2 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (126, 26, 70, 12, 200, '2 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (127, 27, 71, 107, 339, '12 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (130, 27, 72, 121, 315, '8 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (131, 27, 72, 51, 3000, '24 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (133, 27, 72, 2, 299, '4 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (134, 27, 73, 87, 399, '12 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (135, 28, 74, 141, 615, '8 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (137, 29, 76, 105, 265, '12 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (138, 29, 76, 65, 385, '12 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (139, 29, 77, 85, 325, '12 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (141, 29, 78, 29, 800, '2 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (142, 30, 79, 62, 274, '12 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (145, 30, 80, 9, 220, '12 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (146, 30, 81, 126, 390, '8 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (147, 30, 81, 82, 214, '12 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (149, 31, 83, 146, 690, '8 HR', true, '2026-05-25 21:24:54.846033', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (4, 1, 2, 68, 496, '12 HR', true, '2026-05-25 21:24:54.846033', 15, 584);
INSERT INTO public.lab_test_branches VALUES (8, 1, 4, 124, 360, '8 HR', true, '2026-05-25 21:24:54.846033', 15, 424);
INSERT INTO public.lab_test_branches VALUES (12, 3, 7, 19, 450, '12 HR', true, '2026-05-25 21:24:54.846033', 15, 530);
INSERT INTO public.lab_test_branches VALUES (16, 4, 10, 115, 635, '12 HR', true, '2026-05-25 21:24:54.846033', 15, 748);
INSERT INTO public.lab_test_branches VALUES (20, 4, 13, 31, 350, '1 HR', true, '2026-05-25 21:24:54.846033', 15, 412);
INSERT INTO public.lab_test_branches VALUES (24, 6, 16, 127, 405, '8 HR', true, '2026-05-25 21:24:54.846033', 15, 477);
INSERT INTO public.lab_test_branches VALUES (28, 6, 19, 22, 600, '6 HR', true, '2026-05-25 21:24:54.846033', 15, 706);
INSERT INTO public.lab_test_branches VALUES (32, 8, 21, 36, 5500, '6 HR', true, '2026-05-25 21:24:54.846033', 15, 6471);
INSERT INTO public.lab_test_branches VALUES (36, 8, 22, 47, 2500, '24 HR', true, '2026-05-25 21:24:54.846033', 15, 2942);
INSERT INTO public.lab_test_branches VALUES (40, 8, 23, 80, 940, '12 HR', true, '2026-05-25 21:24:54.846033', 15, 1106);
INSERT INTO public.lab_test_branches VALUES (44, 10, 25, 30, 1100, '1 HR', true, '2026-05-25 21:24:54.846033', 15, 1295);
INSERT INTO public.lab_test_branches VALUES (48, 10, 27, 72, 644, '12 HR', true, '2026-05-25 21:24:54.846033', 15, 758);
INSERT INTO public.lab_test_branches VALUES (52, 12, 30, 114, 598, '12 HR', true, '2026-05-25 21:24:54.846033', 15, 704);
INSERT INTO public.lab_test_branches VALUES (56, 12, 30, 3, 199, '2 HR', true, '2026-05-25 21:24:54.846033', 15, 235);
INSERT INTO public.lab_test_branches VALUES (60, 14, 33, 83, 251, '12 HR', true, '2026-05-25 21:24:54.846033', 15, 296);
INSERT INTO public.lab_test_branches VALUES (64, 14, 35, 4, 250, '6 HR', true, '2026-05-25 21:24:54.846033', 15, 295);
INSERT INTO public.lab_test_branches VALUES (68, 16, 38, 97, 769, '12 HR', true, '2026-05-25 21:24:54.846033', 15, 905);
INSERT INTO public.lab_test_branches VALUES (72, 16, 39, 14, 250, '4 HR', true, '2026-05-25 21:24:54.846033', 15, 295);
INSERT INTO public.lab_test_branches VALUES (76, 17, 42, 35, 6500, '4 HR', true, '2026-05-25 21:24:54.846033', 15, 7648);
INSERT INTO public.lab_test_branches VALUES (80, 17, 45, 139, 585, '8 HR', true, '2026-05-25 21:24:54.846033', 15, 689);
INSERT INTO public.lab_test_branches VALUES (84, 18, 49, 61, 237, '12 HR', true, '2026-05-25 21:24:54.846033', 15, 279);
INSERT INTO public.lab_test_branches VALUES (88, 18, 50, 48, 2200, '18 HR', true, '2026-05-25 21:24:54.846033', 15, 2589);
INSERT INTO public.lab_test_branches VALUES (92, 20, 53, 137, 555, '8 HR', true, '2026-05-25 21:24:54.846033', 15, 653);
INSERT INTO public.lab_test_branches VALUES (96, 20, 55, 79, 903, '12 HR', true, '2026-05-25 21:24:54.846033', 15, 1063);
INSERT INTO public.lab_test_branches VALUES (100, 21, 57, 66, 422, '12 HR', true, '2026-05-25 21:24:54.846033', 15, 497);
INSERT INTO public.lab_test_branches VALUES (104, 22, 59, 128, 420, '8 HR', true, '2026-05-25 21:24:54.846033', 15, 495);
INSERT INTO public.lab_test_branches VALUES (108, 23, 61, 148, 720, '8 HR', true, '2026-05-25 21:24:54.846033', 15, 848);
INSERT INTO public.lab_test_branches VALUES (112, 24, 64, 104, 228, '12 HR', true, '2026-05-25 21:24:54.846033', 15, 269);
INSERT INTO public.lab_test_branches VALUES (116, 25, 65, 70, 570, '12 HR', true, '2026-05-25 21:24:54.846033', 15, 671);
INSERT INTO public.lab_test_branches VALUES (120, 25, 67, 46, 999, '24 HR', true, '2026-05-25 21:24:54.846033', 15, 1176);
INSERT INTO public.lab_test_branches VALUES (124, 26, 69, 98, 806, '12 HR', true, '2026-05-25 21:24:54.846033', 15, 949);
INSERT INTO public.lab_test_branches VALUES (128, 27, 71, 67, 459, '12 HR', true, '2026-05-25 21:24:54.846033', 15, 540);
INSERT INTO public.lab_test_branches VALUES (132, 27, 72, 20, 450, '6 HR', true, '2026-05-25 21:24:54.846033', 15, 530);
INSERT INTO public.lab_test_branches VALUES (136, 29, 75, 135, 525, '8 HR', true, '2026-05-25 21:24:54.846033', 15, 618);
INSERT INTO public.lab_test_branches VALUES (140, 29, 78, 41, 3400, '4 HR', true, '2026-05-25 21:24:54.846033', 15, 4000);
INSERT INTO public.lab_test_branches VALUES (144, 30, 79, 102, 954, '12 HR', true, '2026-05-25 21:24:54.846033', 15, 1123);
INSERT INTO public.lab_test_branches VALUES (148, 30, 82, 21, 300, '8 HR', true, '2026-05-25 21:24:54.846033', 15, 353);
INSERT INTO public.lab_test_branches VALUES (122, 26, 68, 78, 866, '12 HR', true, '2026-05-25 21:24:54.846033', 10, 963);
INSERT INTO public.lab_test_branches VALUES (129, 27, 71, 43, 1299, '24 HR', true, '2026-05-25 21:24:54.846033', 10, 1444);
INSERT INTO public.lab_test_branches VALUES (143, 30, 79, 49, 1800, '24 HR', true, '2026-05-25 21:24:54.846033', 10, 2000);
INSERT INTO public.lab_test_branches VALUES (121, 26, 68, 118, 746, '12 HR', true, '2026-05-25 21:24:54.846033', 20, 933);
INSERT INTO public.lab_test_branches VALUES (151, 1, 2, 60, 200, '12 HR', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (153, 1, 4, 60, 200, '12 HR', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (155, 1, 1, 150, 1299, '24 Hours', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (158, 1, 4, 150, 1299, '24 Hours', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (159, 2, 5, 150, 1299, '24 Hours', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (161, 1, 2, 151, 390, '6 Hours', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (162, 1, 3, 151, 390, '6 Hours', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (163, 1, 4, 151, 390, '6 Hours', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (166, 1, 2, 160, 650, '12 Hours', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (167, 1, 3, 160, 650, '12 Hours', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (169, 2, 5, 160, 650, '12 Hours', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (170, 1, 1, 161, 700, '12 Hours', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (173, 1, 4, 161, 700, '12 Hours', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (174, 2, 5, 161, 700, '12 Hours', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (175, 1, 1, 162, 550, '8 Hours', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (177, 1, 3, 162, 550, '8 Hours', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (179, 2, 5, 162, 550, '8 Hours', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (181, 1, 2, 163, 900, '16 Hours', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (182, 1, 3, 163, 900, '16 Hours', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (183, 1, 4, 163, 900, '16 Hours', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (152, 1, 3, 60, 200, '12 HR', true, '2026-05-28 16:06:52.814734', 15, 236);
INSERT INTO public.lab_test_branches VALUES (156, 1, 2, 150, 1299, '24 Hours', true, '2026-05-28 16:06:52.814734', 15, 1529);
INSERT INTO public.lab_test_branches VALUES (160, 1, 1, 151, 390, '6 Hours', true, '2026-05-28 16:06:52.814734', 15, 459);
INSERT INTO public.lab_test_branches VALUES (164, 2, 5, 151, 390, '6 Hours', true, '2026-05-28 16:06:52.814734', 15, 459);
INSERT INTO public.lab_test_branches VALUES (168, 1, 4, 160, 650, '12 Hours', true, '2026-05-28 16:06:52.814734', 15, 765);
INSERT INTO public.lab_test_branches VALUES (172, 1, 3, 161, 700, '12 Hours', true, '2026-05-28 16:06:52.814734', 15, 824);
INSERT INTO public.lab_test_branches VALUES (176, 1, 2, 162, 550, '8 Hours', true, '2026-05-28 16:06:52.814734', 15, 648);
INSERT INTO public.lab_test_branches VALUES (180, 1, 1, 163, 900, '16 Hours', true, '2026-05-28 16:06:52.814734', 15, 1059);
INSERT INTO public.lab_test_branches VALUES (184, 2, 5, 163, 900, '16 Hours', true, '2026-05-28 16:06:52.814734', 15, 1059);
INSERT INTO public.lab_test_branches VALUES (150, 1, 1, 60, 200, '12 HR', true, '2026-05-28 16:06:52.814734', 10, 223);
INSERT INTO public.lab_test_branches VALUES (157, 1, 3, 150, 1299, '24 Hours', true, '2026-05-28 16:06:52.814734', 10, 1444);
INSERT INTO public.lab_test_branches VALUES (171, 1, 2, 161, 700, '12 Hours', true, '2026-05-28 16:06:52.814734', 10, 778);
INSERT INTO public.lab_test_branches VALUES (178, 1, 4, 162, 550, '8 Hours', true, '2026-05-28 16:06:52.814734', 10, 612);
INSERT INTO public.lab_test_branches VALUES (185, 1, 1, 164, 1100, '12 Hours', true, '2026-05-28 16:06:52.814734', 10, 1223);
INSERT INTO public.lab_test_branches VALUES (154, 2, 5, 60, 200, '12 HR', true, '2026-05-28 16:06:52.814734', 20, 250);
INSERT INTO public.lab_test_branches VALUES (165, 1, 1, 160, 650, '12 Hours', true, '2026-05-28 16:06:52.814734', 20, 813);
INSERT INTO public.lab_test_branches VALUES (186, 1, 2, 164, 1100, '12 Hours', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (189, 2, 5, 164, 1100, '12 Hours', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (190, 1, 1, 165, 1200, '4 Hours', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (191, 1, 2, 165, 1200, '4 Hours', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (193, 1, 4, 165, 1200, '4 Hours', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (194, 2, 5, 165, 1200, '4 Hours', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (195, 1, 1, 166, 800, '6 Hours', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (197, 1, 3, 166, 800, '6 Hours', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (201, 1, 2, 115, 635, '12 HR', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (202, 1, 3, 115, 635, '12 HR', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (203, 1, 4, 115, 635, '12 HR', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (205, 1, 1, 152, 950, '48 Hours', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (207, 1, 3, 152, 950, '48 Hours', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (210, 1, 1, 153, 1499, '24 Hours', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (211, 1, 2, 153, 1499, '24 Hours', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (214, 2, 5, 153, 1499, '24 Hours', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (215, 1, 1, 17, 400, '8 HR', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (217, 1, 3, 17, 400, '8 HR', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (218, 1, 4, 17, 400, '8 HR', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (219, 2, 5, 17, 400, '8 HR', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (225, 1, 1, 65, 385, '12 HR', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (226, 1, 2, 65, 385, '12 HR', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (229, 2, 5, 65, 385, '12 HR', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (230, 1, 1, 66, 422, '12 HR', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (233, 1, 4, 66, 422, '12 HR', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (235, 1, 1, 154, 149, '6 Hours', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (237, 1, 3, 154, 149, '6 Hours', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (238, 1, 4, 154, 149, '6 Hours', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (239, 2, 5, 154, 149, '6 Hours', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (243, 1, 4, 167, 99, '4 Hours', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (245, 1, 1, 168, 800, '12 Hours', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (246, 1, 2, 168, 800, '12 Hours', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (247, 1, 3, 168, 800, '12 Hours', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (249, 2, 5, 168, 800, '12 Hours', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (250, 1, 1, 169, 450, '8 Hours', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (251, 1, 2, 169, 450, '8 Hours', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (254, 2, 5, 169, 450, '8 Hours', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (257, 1, 3, 170, 350, '12 Hours', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (258, 1, 4, 170, 350, '12 Hours', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (259, 2, 5, 170, 350, '12 Hours', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (261, 1, 2, 171, 950, '12 Hours', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (263, 1, 4, 171, 950, '12 Hours', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (265, 1, 1, 172, 1499, '12 Hours', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (266, 1, 2, 172, 1499, '12 Hours', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (267, 1, 3, 172, 1499, '12 Hours', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (270, 1, 1, 155, 549, '12 Hours', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (271, 1, 2, 155, 549, '12 Hours', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (273, 1, 4, 155, 549, '12 Hours', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (274, 2, 5, 155, 549, '12 Hours', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (277, 1, 3, 156, 2499, '36 Hours', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (278, 1, 4, 156, 2499, '36 Hours', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (279, 2, 5, 156, 2499, '36 Hours', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (281, 1, 2, 173, 599, '24 Hours', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (282, 1, 3, 173, 599, '24 Hours', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (285, 1, 1, 157, 3490, '48 Hours', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (287, 1, 3, 157, 3490, '48 Hours', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (199, 2, 5, 166, 800, '6 Hours', true, '2026-05-28 16:06:52.814734', 10, 889);
INSERT INTO public.lab_test_branches VALUES (206, 1, 2, 152, 950, '48 Hours', true, '2026-05-28 16:06:52.814734', 10, 1056);
INSERT INTO public.lab_test_branches VALUES (213, 1, 4, 153, 1499, '24 Hours', true, '2026-05-28 16:06:52.814734', 10, 1666);
INSERT INTO public.lab_test_branches VALUES (227, 1, 3, 65, 385, '12 HR', true, '2026-05-28 16:06:52.814734', 10, 428);
INSERT INTO public.lab_test_branches VALUES (234, 2, 5, 66, 422, '12 HR', true, '2026-05-28 16:06:52.814734', 10, 469);
INSERT INTO public.lab_test_branches VALUES (241, 1, 2, 167, 99, '4 Hours', true, '2026-05-28 16:06:52.814734', 10, 110);
INSERT INTO public.lab_test_branches VALUES (255, 1, 1, 170, 350, '12 Hours', true, '2026-05-28 16:06:52.814734', 10, 389);
INSERT INTO public.lab_test_branches VALUES (262, 1, 3, 171, 950, '12 Hours', true, '2026-05-28 16:06:52.814734', 10, 1056);
INSERT INTO public.lab_test_branches VALUES (269, 2, 5, 172, 1499, '12 Hours', true, '2026-05-28 16:06:52.814734', 10, 1666);
INSERT INTO public.lab_test_branches VALUES (283, 1, 4, 173, 599, '24 Hours', true, '2026-05-28 16:06:52.814734', 10, 666);
INSERT INTO public.lab_test_branches VALUES (187, 1, 3, 164, 1100, '12 Hours', true, '2026-05-28 16:06:52.814734', 20, 1375);
INSERT INTO public.lab_test_branches VALUES (198, 1, 4, 166, 800, '6 Hours', true, '2026-05-28 16:06:52.814734', 20, 1000);
INSERT INTO public.lab_test_branches VALUES (209, 2, 5, 152, 950, '48 Hours', true, '2026-05-28 16:06:52.814734', 20, 1188);
INSERT INTO public.lab_test_branches VALUES (231, 1, 2, 66, 422, '12 HR', true, '2026-05-28 16:06:52.814734', 20, 528);
INSERT INTO public.lab_test_branches VALUES (242, 1, 3, 167, 99, '4 Hours', true, '2026-05-28 16:06:52.814734', 20, 124);
INSERT INTO public.lab_test_branches VALUES (253, 1, 4, 169, 450, '8 Hours', true, '2026-05-28 16:06:52.814734', 20, 563);
INSERT INTO public.lab_test_branches VALUES (275, 1, 1, 156, 2499, '36 Hours', true, '2026-05-28 16:06:52.814734', 20, 3124);
INSERT INTO public.lab_test_branches VALUES (286, 1, 2, 157, 3490, '48 Hours', true, '2026-05-28 16:06:52.814734', 20, 4363);
INSERT INTO public.lab_test_branches VALUES (289, 2, 5, 157, 3490, '48 Hours', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (291, 1, 2, 86, 362, '12 HR', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (293, 1, 4, 86, 362, '12 HR', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (294, 2, 5, 86, 362, '12 HR', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (295, 1, 1, 117, 709, '12 HR', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (298, 1, 4, 117, 709, '12 HR', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (299, 2, 5, 117, 709, '12 HR', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (301, 1, 2, 158, 6999, '7 Days', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (302, 1, 3, 158, 6999, '7 Days', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (303, 1, 4, 158, 6999, '7 Days', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (305, 1, 1, 159, 12499, '10 Days', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (306, 1, 2, 159, 12499, '10 Days', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (307, 1, 3, 159, 12499, '10 Days', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (309, 2, 5, 159, 12499, '10 Days', true, '2026-05-28 16:06:52.814734', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (188, 1, 4, 164, 1100, '12 Hours', true, '2026-05-28 16:06:52.814734', 15, 1295);
INSERT INTO public.lab_test_branches VALUES (192, 1, 3, 165, 1200, '4 Hours', true, '2026-05-28 16:06:52.814734', 15, 1412);
INSERT INTO public.lab_test_branches VALUES (196, 1, 2, 166, 800, '6 Hours', true, '2026-05-28 16:06:52.814734', 15, 942);
INSERT INTO public.lab_test_branches VALUES (200, 1, 1, 115, 635, '12 HR', true, '2026-05-28 16:06:52.814734', 15, 748);
INSERT INTO public.lab_test_branches VALUES (204, 2, 5, 115, 635, '12 HR', true, '2026-05-28 16:06:52.814734', 15, 748);
INSERT INTO public.lab_test_branches VALUES (208, 1, 4, 152, 950, '48 Hours', true, '2026-05-28 16:06:52.814734', 15, 1118);
INSERT INTO public.lab_test_branches VALUES (212, 1, 3, 153, 1499, '24 Hours', true, '2026-05-28 16:06:52.814734', 15, 1764);
INSERT INTO public.lab_test_branches VALUES (216, 1, 2, 17, 400, '8 HR', true, '2026-05-28 16:06:52.814734', 15, 471);
INSERT INTO public.lab_test_branches VALUES (228, 1, 4, 65, 385, '12 HR', true, '2026-05-28 16:06:52.814734', 15, 453);
INSERT INTO public.lab_test_branches VALUES (232, 1, 3, 66, 422, '12 HR', true, '2026-05-28 16:06:52.814734', 15, 497);
INSERT INTO public.lab_test_branches VALUES (236, 1, 2, 154, 149, '6 Hours', true, '2026-05-28 16:06:52.814734', 15, 176);
INSERT INTO public.lab_test_branches VALUES (240, 1, 1, 167, 99, '4 Hours', true, '2026-05-28 16:06:52.814734', 15, 117);
INSERT INTO public.lab_test_branches VALUES (244, 2, 5, 167, 99, '4 Hours', true, '2026-05-28 16:06:52.814734', 15, 117);
INSERT INTO public.lab_test_branches VALUES (248, 1, 4, 168, 800, '12 Hours', true, '2026-05-28 16:06:52.814734', 15, 942);
INSERT INTO public.lab_test_branches VALUES (252, 1, 3, 169, 450, '8 Hours', true, '2026-05-28 16:06:52.814734', 15, 530);
INSERT INTO public.lab_test_branches VALUES (256, 1, 2, 170, 350, '12 Hours', true, '2026-05-28 16:06:52.814734', 15, 412);
INSERT INTO public.lab_test_branches VALUES (260, 1, 1, 171, 950, '12 Hours', true, '2026-05-28 16:06:52.814734', 15, 1118);
INSERT INTO public.lab_test_branches VALUES (264, 2, 5, 171, 950, '12 Hours', true, '2026-05-28 16:06:52.814734', 15, 1118);
INSERT INTO public.lab_test_branches VALUES (268, 1, 4, 172, 1499, '12 Hours', true, '2026-05-28 16:06:52.814734', 15, 1764);
INSERT INTO public.lab_test_branches VALUES (272, 1, 3, 155, 549, '12 Hours', true, '2026-05-28 16:06:52.814734', 15, 646);
INSERT INTO public.lab_test_branches VALUES (276, 1, 2, 156, 2499, '36 Hours', true, '2026-05-28 16:06:52.814734', 15, 2940);
INSERT INTO public.lab_test_branches VALUES (280, 1, 1, 173, 599, '24 Hours', true, '2026-05-28 16:06:52.814734', 15, 705);
INSERT INTO public.lab_test_branches VALUES (284, 2, 5, 173, 599, '24 Hours', true, '2026-05-28 16:06:52.814734', 15, 705);
INSERT INTO public.lab_test_branches VALUES (288, 1, 4, 157, 3490, '48 Hours', true, '2026-05-28 16:06:52.814734', 15, 4106);
INSERT INTO public.lab_test_branches VALUES (292, 1, 3, 86, 362, '12 HR', true, '2026-05-28 16:06:52.814734', 15, 426);
INSERT INTO public.lab_test_branches VALUES (296, 1, 2, 117, 709, '12 HR', true, '2026-05-28 16:06:52.814734', 15, 835);
INSERT INTO public.lab_test_branches VALUES (300, 1, 1, 158, 6999, '7 Days', true, '2026-05-28 16:06:52.814734', 15, 8235);
INSERT INTO public.lab_test_branches VALUES (304, 2, 5, 158, 6999, '7 Days', true, '2026-05-28 16:06:52.814734', 15, 8235);
INSERT INTO public.lab_test_branches VALUES (308, 1, 4, 159, 12499, '10 Days', true, '2026-05-28 16:06:52.814734', 15, 14705);
INSERT INTO public.lab_test_branches VALUES (290, 1, 1, 86, 362, '12 HR', true, '2026-05-28 16:06:52.814734', 10, 403);
INSERT INTO public.lab_test_branches VALUES (297, 1, 3, 117, 709, '12 HR', true, '2026-05-28 16:06:52.814734', 10, 788);
INSERT INTO public.lab_test_branches VALUES (310, 1, 1, 90, 510, '12 HR', true, '2026-05-28 16:10:39.991705', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (313, 1, 4, 90, 510, '12 HR', true, '2026-05-28 16:10:39.991705', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (314, 2, 5, 90, 510, '12 HR', true, '2026-05-28 16:10:39.991705', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (375, 1, 1, 64, 348, '12 HR', true, '2026-05-28 16:10:39.991705', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (377, 1, 3, 64, 348, '12 HR', true, '2026-05-28 16:10:39.991705', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (378, 1, 4, 64, 348, '12 HR', true, '2026-05-28 16:10:39.991705', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (379, 2, 5, 64, 348, '12 HR', true, '2026-05-28 16:10:39.991705', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (382, 1, 3, 16, 550, '12 HR', true, '2026-05-28 16:10:39.991705', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (383, 1, 4, 16, 550, '12 HR', true, '2026-05-28 16:10:39.991705', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (390, 1, 1, 96, 732, '12 HR', true, '2026-05-28 16:10:39.991705', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (391, 1, 2, 96, 732, '12 HR', true, '2026-05-28 16:10:39.991705', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (393, 1, 4, 96, 732, '12 HR', true, '2026-05-28 16:10:39.991705', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (394, 2, 5, 96, 732, '12 HR', true, '2026-05-28 16:10:39.991705', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (312, 1, 3, 90, 510, '12 HR', true, '2026-05-28 16:10:39.991705', 15, 600);
INSERT INTO public.lab_test_branches VALUES (376, 1, 2, 64, 348, '12 HR', true, '2026-05-28 16:10:39.991705', 15, 410);
INSERT INTO public.lab_test_branches VALUES (380, 1, 1, 16, 550, '12 HR', true, '2026-05-28 16:10:39.991705', 15, 648);
INSERT INTO public.lab_test_branches VALUES (384, 2, 5, 16, 550, '12 HR', true, '2026-05-28 16:10:39.991705', 15, 648);
INSERT INTO public.lab_test_branches VALUES (392, 1, 3, 96, 732, '12 HR', true, '2026-05-28 16:10:39.991705', 15, 862);
INSERT INTO public.lab_test_branches VALUES (311, 1, 2, 90, 510, '12 HR', true, '2026-05-28 16:10:39.991705', 10, 567);
INSERT INTO public.lab_test_branches VALUES (381, 1, 2, 16, 550, '12 HR', true, '2026-05-28 16:10:39.991705', 10, 612);
INSERT INTO public.lab_test_branches VALUES (705, 1, 1, 20, 450, '6 HR', true, '2026-05-28 16:22:53.474176', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (706, 1, 2, 20, 450, '6 HR', true, '2026-05-28 16:22:53.474176', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (707, 1, 3, 20, 450, '6 HR', true, '2026-05-28 16:22:53.474176', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (709, 2, 5, 20, 450, '6 HR', true, '2026-05-28 16:22:53.474176', 0, NULL);
INSERT INTO public.lab_test_branches VALUES (708, 1, 4, 20, 450, '6 HR', true, '2026-05-28 16:22:53.474176', 15, 530);


--
-- TOC entry 5173 (class 0 OID 60481)
-- Dependencies: 222
-- Data for Name: labs; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.labs VALUES (1, 'Apollo Diagnostics', '011-2319-8609', 'apollodiagnostics@choosemylab.example', 'https://example.com/apollo-diagnostics', true, true, '2026-05-25 21:24:54.824003', '2026-05-25 21:24:54.824003', 3.9, 187);
INSERT INTO public.labs VALUES (3, 'Bhasin Medicare', '011-6454-9187', 'bhasinmedicare@choosemylab.example', 'https://example.com/bhasin-medicare', true, true, '2026-05-25 21:24:54.824003', '2026-05-25 21:24:54.824003', 4.1, 461);
INSERT INTO public.labs VALUES (4, 'City X-Ray & Scan', '011-2540-9936', 'cityxrayscan@choosemylab.example', 'https://example.com/city-x-ray-scan', true, true, '2026-05-25 21:24:54.824003', '2026-05-25 21:24:54.824003', 4.2, 598);
INSERT INTO public.labs VALUES (5, 'City X-Ray & Scan Branch 25', '011-3503-7138', 'cityxrayscanbranch25@choosemylab.example', 'https://example.com/city-x-ray-scan-branch-25', true, true, '2026-05-25 21:24:54.824003', '2026-05-25 21:24:54.824003', 4.3, 735);
INSERT INTO public.labs VALUES (6, 'Dr. Dang Lab', '011-3402-7789', 'drdanglab@choosemylab.example', 'https://example.com/dr-dang-lab', true, true, '2026-05-25 21:24:54.824003', '2026-05-25 21:24:54.824003', 4.4, 872);
INSERT INTO public.labs VALUES (7, 'Dr. Dang Lab Branch 27', '011-1829-4652', 'drdanglabbranch27@choosemylab.example', 'https://example.com/dr-dang-lab-branch-27', true, true, '2026-05-25 21:24:54.824003', '2026-05-25 21:24:54.824003', 4.5, 1009);
INSERT INTO public.labs VALUES (8, 'Dr. Lal PathLabs', '011-4647-9492', 'drlalpathlabs@choosemylab.example', 'https://example.com/dr-lal-pathlabs', true, true, '2026-05-25 21:24:54.824003', '2026-05-25 21:24:54.824003', 4.6, 1146);
INSERT INTO public.labs VALUES (9, 'Dr. Lal PathLabs Branch 20', '011-1646-3189', 'drlalpathlabsbranch20@choosemylab.example', 'https://example.com/dr-lal-pathlabs-branch-20', true, true, '2026-05-25 21:24:54.824003', '2026-05-25 21:24:54.824003', 4.7, 1283);
INSERT INTO public.labs VALUES (10, 'Focus Imaging', '011-9089-2740', 'focusimaging@choosemylab.example', 'https://example.com/focus-imaging', true, true, '2026-05-25 21:24:54.824003', '2026-05-25 21:24:54.824003', 4.8, 1420);
INSERT INTO public.labs VALUES (11, 'Fortis Diagnostic', '011-5020-5991', 'fortisdiagnostic@choosemylab.example', 'https://example.com/fortis-diagnostic', true, true, '2026-05-25 21:24:54.824003', '2026-05-25 21:24:54.824003', 4.9, 1557);
INSERT INTO public.labs VALUES (12, 'Ganesh Diagnostic', '011-7591-2703', 'ganeshdiagnostic@choosemylab.example', 'https://example.com/ganesh-diagnostic', true, true, '2026-05-25 21:24:54.824003', '2026-05-25 21:24:54.824003', 3.8, 1694);
INSERT INTO public.labs VALUES (13, 'Ganesh Diagnostic Branch 22', '011-6109-3205', 'ganeshdiagnosticbranch22@choosemylab.example', 'https://example.com/ganesh-diagnostic-branch-22', true, true, '2026-05-25 21:24:54.824003', '2026-05-25 21:24:54.824003', 3.9, 1831);
INSERT INTO public.labs VALUES (15, 'Healthians Branch 29', '011-1220-1406', 'healthiansbranch29@choosemylab.example', 'https://example.com/healthians-branch-29', true, true, '2026-05-25 21:24:54.824003', '2026-05-25 21:24:54.824003', 4.1, 2105);
INSERT INTO public.labs VALUES (16, 'House of Diagnostics (HOD)', '011-8520-2187', 'houseofdiagnosticshod@choosemylab.example', 'https://example.com/house-of-diagnostics-hod-', true, true, '2026-05-25 21:24:54.824003', '2026-05-25 21:24:54.824003', 4.2, 2242);
INSERT INTO public.labs VALUES (17, 'Mahajan Imaging', '011-6926-4309', 'mahajanimaging@choosemylab.example', 'https://example.com/mahajan-imaging', true, true, '2026-05-25 21:24:54.824003', '2026-05-25 21:24:54.824003', 4.3, 2379);
INSERT INTO public.labs VALUES (2, 'Apollo Diagnostics Branch 24', '011-8623-8808', 'apollodiagnosticsbranch24@choosemylab.example', 'https://example.com/apollo-diagnostics-branch-24', true, true, '2026-05-25 21:24:54.824003', '2026-05-25 21:24:54.824003', 4.0, 324);
INSERT INTO public.labs VALUES (14, 'Healthians', '011-5365-8476', 'healthians@choosemylab.example', 'https://example.com/healthians', true, true, '2026-05-25 21:24:54.824003', '2026-05-25 21:24:54.824003', 4.0, 1968);
INSERT INTO public.labs VALUES (18, 'Max Lab', '011-7709-8031', 'maxlab@choosemylab.example', 'https://example.com/max-lab', true, true, '2026-05-25 21:24:54.824003', '2026-05-25 21:24:54.824003', 4.4, 2516);
INSERT INTO public.labs VALUES (19, 'Max Lab Branch 23', '011-4762-3857', 'maxlabbranch23@choosemylab.example', 'https://example.com/max-lab-branch-23', true, true, '2026-05-25 21:24:54.824003', '2026-05-25 21:24:54.824003', 4.5, 2653);
INSERT INTO public.labs VALUES (20, 'Metro Diagnostics', '011-7859-9260', 'metrodiagnostics@choosemylab.example', 'https://example.com/metro-diagnostics', true, true, '2026-05-25 21:24:54.824003', '2026-05-25 21:24:54.824003', 4.6, 2790);
INSERT INTO public.labs VALUES (21, 'Modern Diagnostic', '011-1853-5476', 'moderndiagnostic@choosemylab.example', 'https://example.com/modern-diagnostic', true, true, '2026-05-25 21:24:54.824003', '2026-05-25 21:24:54.824003', 4.7, 2927);
INSERT INTO public.labs VALUES (22, 'Pathkind Labs', '011-4451-5861', 'pathkindlabs@choosemylab.example', 'https://example.com/pathkind-labs', true, true, '2026-05-25 21:24:54.824003', '2026-05-25 21:24:54.824003', 4.8, 3064);
INSERT INTO public.labs VALUES (23, 'Pathkind Labs Branch 28', '011-4822-3643', 'pathkindlabsbranch28@choosemylab.example', 'https://example.com/pathkind-labs-branch-28', true, true, '2026-05-25 21:24:54.824003', '2026-05-25 21:24:54.824003', 4.9, 3201);
INSERT INTO public.labs VALUES (24, 'Prognosis Laboratories', '011-4345-7414', 'prognosislaboratories@choosemylab.example', 'https://example.com/prognosis-laboratories', true, true, '2026-05-25 21:24:54.824003', '2026-05-25 21:24:54.824003', 3.8, 3338);
INSERT INTO public.labs VALUES (25, 'Redcliffe Labs', '011-3077-2183', 'redcliffelabs@choosemylab.example', 'https://example.com/redcliffe-labs', true, true, '2026-05-25 21:24:54.824003', '2026-05-25 21:24:54.824003', 3.9, 3475);
INSERT INTO public.labs VALUES (27, 'SRL Diagnostics', '011-6255-9385', 'srldiagnostics@choosemylab.example', 'https://example.com/srl-diagnostics', true, true, '2026-05-25 21:24:54.824003', '2026-05-25 21:24:54.824003', 4.1, 3749);
INSERT INTO public.labs VALUES (28, 'SRL Diagnostics Branch 21', '011-1503-3240', 'srldiagnosticsbranch21@choosemylab.example', 'https://example.com/srl-diagnostics-branch-21', true, true, '2026-05-25 21:24:54.824003', '2026-05-25 21:24:54.824003', 4.2, 3886);
INSERT INTO public.labs VALUES (29, 'Star Imaging', '011-1378-8890', 'starimaging@choosemylab.example', 'https://example.com/star-imaging', true, true, '2026-05-25 21:24:54.824003', '2026-05-25 21:24:54.824003', 4.3, 4023);
INSERT INTO public.labs VALUES (30, 'Thyrocare', '011-7380-3434', 'thyrocare@choosemylab.example', 'https://example.com/thyrocare', true, true, '2026-05-25 21:24:54.824003', '2026-05-25 21:24:54.824003', 4.4, 4160);
INSERT INTO public.labs VALUES (31, 'Thyrocare Branch 26', '011-8065-4333', 'thyrocarebranch26@choosemylab.example', 'https://example.com/thyrocare-branch-26', true, true, '2026-05-25 21:24:54.824003', '2026-05-25 21:24:54.824003', 4.5, 4297);
INSERT INTO public.labs VALUES (26, 'Saral Advanced', '011-1127-9237', 'saraladvanced@choosemylab.example', 'https://example.com/saral-advanced', true, true, '2026-05-25 21:24:54.824003', '2026-05-25 21:24:54.824003', 4.0, 3612);


--
-- TOC entry 5185 (class 0 OID 60604)
-- Dependencies: 234
-- Data for Name: package_tests; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.package_tests VALUES (1, 1, 93);
INSERT INTO public.package_tests VALUES (2, 1, 60);
INSERT INTO public.package_tests VALUES (3, 1, 16);
INSERT INTO public.package_tests VALUES (4, 1, 2);
INSERT INTO public.package_tests VALUES (5, 1, 7);
INSERT INTO public.package_tests VALUES (6, 1, 20);
INSERT INTO public.package_tests VALUES (7, 2, 93);
INSERT INTO public.package_tests VALUES (8, 2, 60);
INSERT INTO public.package_tests VALUES (9, 2, 16);
INSERT INTO public.package_tests VALUES (10, 2, 2);
INSERT INTO public.package_tests VALUES (11, 2, 7);
INSERT INTO public.package_tests VALUES (12, 2, 20);
INSERT INTO public.package_tests VALUES (13, 3, 93);
INSERT INTO public.package_tests VALUES (14, 3, 60);
INSERT INTO public.package_tests VALUES (15, 3, 16);
INSERT INTO public.package_tests VALUES (16, 3, 2);
INSERT INTO public.package_tests VALUES (17, 3, 7);
INSERT INTO public.package_tests VALUES (18, 3, 20);
INSERT INTO public.package_tests VALUES (667, 1, 63);
INSERT INTO public.package_tests VALUES (669, 1, 17);
INSERT INTO public.package_tests VALUES (672, 1, 65);
INSERT INTO public.package_tests VALUES (673, 2, 63);
INSERT INTO public.package_tests VALUES (675, 2, 17);
INSERT INTO public.package_tests VALUES (678, 2, 65);
INSERT INTO public.package_tests VALUES (679, 3, 63);
INSERT INTO public.package_tests VALUES (681, 3, 17);
INSERT INTO public.package_tests VALUES (684, 3, 65);
INSERT INTO public.package_tests VALUES (685, 115, 115);
INSERT INTO public.package_tests VALUES (686, 115, 85);
INSERT INTO public.package_tests VALUES (687, 115, 15);
INSERT INTO public.package_tests VALUES (688, 115, 13);
INSERT INTO public.package_tests VALUES (689, 115, 11);
INSERT INTO public.package_tests VALUES (690, 116, 153);
INSERT INTO public.package_tests VALUES (691, 116, 152);
INSERT INTO public.package_tests VALUES (692, 116, 17);
INSERT INTO public.package_tests VALUES (693, 116, 18);
INSERT INTO public.package_tests VALUES (694, 116, 64);
INSERT INTO public.package_tests VALUES (695, 117, 115);
INSERT INTO public.package_tests VALUES (696, 117, 85);
INSERT INTO public.package_tests VALUES (697, 117, 15);
INSERT INTO public.package_tests VALUES (698, 117, 13);
INSERT INTO public.package_tests VALUES (699, 117, 11);
INSERT INTO public.package_tests VALUES (700, 118, 153);
INSERT INTO public.package_tests VALUES (701, 118, 152);
INSERT INTO public.package_tests VALUES (702, 118, 15);
INSERT INTO public.package_tests VALUES (703, 118, 13);
INSERT INTO public.package_tests VALUES (704, 118, 11);
INSERT INTO public.package_tests VALUES (705, 119, 60);
INSERT INTO public.package_tests VALUES (706, 119, 90);
INSERT INTO public.package_tests VALUES (707, 119, 162);
INSERT INTO public.package_tests VALUES (708, 119, 113);
INSERT INTO public.package_tests VALUES (709, 119, 83);
INSERT INTO public.package_tests VALUES (710, 119, 15);
INSERT INTO public.package_tests VALUES (711, 119, 13);
INSERT INTO public.package_tests VALUES (712, 119, 11);
INSERT INTO public.package_tests VALUES (713, 120, 109);
INSERT INTO public.package_tests VALUES (714, 120, 79);
INSERT INTO public.package_tests VALUES (715, 120, 162);
INSERT INTO public.package_tests VALUES (716, 120, 160);
INSERT INTO public.package_tests VALUES (717, 120, 161);
INSERT INTO public.package_tests VALUES (718, 120, 60);
INSERT INTO public.package_tests VALUES (719, 120, 90);
INSERT INTO public.package_tests VALUES (720, 121, 60);
INSERT INTO public.package_tests VALUES (721, 121, 90);
INSERT INTO public.package_tests VALUES (722, 121, 160);
INSERT INTO public.package_tests VALUES (723, 121, 161);
INSERT INTO public.package_tests VALUES (724, 122, 65);
INSERT INTO public.package_tests VALUES (725, 122, 20);
INSERT INTO public.package_tests VALUES (726, 122, 21);
INSERT INTO public.package_tests VALUES (727, 122, 170);
INSERT INTO public.package_tests VALUES (728, 122, 111);
INSERT INTO public.package_tests VALUES (729, 122, 81);
INSERT INTO public.package_tests VALUES (730, 122, 82);
INSERT INTO public.package_tests VALUES (731, 122, 112);
INSERT INTO public.package_tests VALUES (732, 123, 65);
INSERT INTO public.package_tests VALUES (733, 123, 20);
INSERT INTO public.package_tests VALUES (734, 123, 21);
INSERT INTO public.package_tests VALUES (735, 123, 170);
INSERT INTO public.package_tests VALUES (736, 123, 66);
INSERT INTO public.package_tests VALUES (737, 123, 96);
INSERT INTO public.package_tests VALUES (738, 123, 154);
INSERT INTO public.package_tests VALUES (739, 124, 17);
INSERT INTO public.package_tests VALUES (740, 124, 18);
INSERT INTO public.package_tests VALUES (741, 124, 64);
INSERT INTO public.package_tests VALUES (742, 124, 70);
INSERT INTO public.package_tests VALUES (743, 124, 100);
INSERT INTO public.package_tests VALUES (744, 124, 15);
INSERT INTO public.package_tests VALUES (745, 124, 13);
INSERT INTO public.package_tests VALUES (746, 124, 11);
INSERT INTO public.package_tests VALUES (747, 124, 170);
INSERT INTO public.package_tests VALUES (748, 125, 17);
INSERT INTO public.package_tests VALUES (749, 125, 18);
INSERT INTO public.package_tests VALUES (750, 125, 64);
INSERT INTO public.package_tests VALUES (751, 125, 70);
INSERT INTO public.package_tests VALUES (752, 125, 100);
INSERT INTO public.package_tests VALUES (753, 125, 15);
INSERT INTO public.package_tests VALUES (754, 125, 13);
INSERT INTO public.package_tests VALUES (755, 125, 11);
INSERT INTO public.package_tests VALUES (756, 126, 7);
INSERT INTO public.package_tests VALUES (757, 126, 6);
INSERT INTO public.package_tests VALUES (758, 126, 8);
INSERT INTO public.package_tests VALUES (759, 126, 70);
INSERT INTO public.package_tests VALUES (760, 126, 100);
INSERT INTO public.package_tests VALUES (761, 126, 102);
INSERT INTO public.package_tests VALUES (762, 126, 72);
INSERT INTO public.package_tests VALUES (763, 126, 60);
INSERT INTO public.package_tests VALUES (764, 126, 90);
INSERT INTO public.package_tests VALUES (765, 126, 15);
INSERT INTO public.package_tests VALUES (766, 126, 13);
INSERT INTO public.package_tests VALUES (767, 126, 11);
INSERT INTO public.package_tests VALUES (768, 127, 153);
INSERT INTO public.package_tests VALUES (769, 127, 70);
INSERT INTO public.package_tests VALUES (770, 127, 100);
INSERT INTO public.package_tests VALUES (771, 127, 17);
INSERT INTO public.package_tests VALUES (772, 127, 18);
INSERT INTO public.package_tests VALUES (773, 127, 64);
INSERT INTO public.package_tests VALUES (774, 127, 7);
INSERT INTO public.package_tests VALUES (775, 127, 6);
INSERT INTO public.package_tests VALUES (776, 127, 8);
INSERT INTO public.package_tests VALUES (777, 127, 60);
INSERT INTO public.package_tests VALUES (778, 127, 90);
INSERT INTO public.package_tests VALUES (779, 127, 15);
INSERT INTO public.package_tests VALUES (780, 127, 13);
INSERT INTO public.package_tests VALUES (781, 127, 11);
INSERT INTO public.package_tests VALUES (782, 128, 17);
INSERT INTO public.package_tests VALUES (783, 128, 18);
INSERT INTO public.package_tests VALUES (784, 128, 64);
INSERT INTO public.package_tests VALUES (785, 129, 17);
INSERT INTO public.package_tests VALUES (786, 129, 18);
INSERT INTO public.package_tests VALUES (787, 129, 64);
INSERT INTO public.package_tests VALUES (790, 129, 16);
INSERT INTO public.package_tests VALUES (791, 130, 15);
INSERT INTO public.package_tests VALUES (792, 130, 13);
INSERT INTO public.package_tests VALUES (793, 130, 11);
INSERT INTO public.package_tests VALUES (794, 130, 60);
INSERT INTO public.package_tests VALUES (795, 130, 90);
INSERT INTO public.package_tests VALUES (796, 130, 17);
INSERT INTO public.package_tests VALUES (797, 130, 18);
INSERT INTO public.package_tests VALUES (798, 130, 64);
INSERT INTO public.package_tests VALUES (799, 130, 2);
INSERT INTO public.package_tests VALUES (800, 130, 4);
INSERT INTO public.package_tests VALUES (801, 130, 5);
INSERT INTO public.package_tests VALUES (802, 130, 7);
INSERT INTO public.package_tests VALUES (803, 130, 6);
INSERT INTO public.package_tests VALUES (804, 130, 8);
INSERT INTO public.package_tests VALUES (805, 131, 15);
INSERT INTO public.package_tests VALUES (806, 131, 13);
INSERT INTO public.package_tests VALUES (807, 131, 11);
INSERT INTO public.package_tests VALUES (808, 131, 60);
INSERT INTO public.package_tests VALUES (809, 131, 90);
INSERT INTO public.package_tests VALUES (810, 131, 17);
INSERT INTO public.package_tests VALUES (811, 131, 18);
INSERT INTO public.package_tests VALUES (812, 131, 64);
INSERT INTO public.package_tests VALUES (813, 131, 2);
INSERT INTO public.package_tests VALUES (814, 131, 4);
INSERT INTO public.package_tests VALUES (815, 131, 5);
INSERT INTO public.package_tests VALUES (816, 131, 7);
INSERT INTO public.package_tests VALUES (817, 131, 6);
INSERT INTO public.package_tests VALUES (818, 131, 8);
INSERT INTO public.package_tests VALUES (819, 131, 24);
INSERT INTO public.package_tests VALUES (820, 131, 68);
INSERT INTO public.package_tests VALUES (821, 131, 25);
INSERT INTO public.package_tests VALUES (822, 131, 99);
INSERT INTO public.package_tests VALUES (823, 131, 69);
INSERT INTO public.package_tests VALUES (824, 131, 70);
INSERT INTO public.package_tests VALUES (825, 131, 100);
INSERT INTO public.package_tests VALUES (826, 131, 170);
INSERT INTO public.package_tests VALUES (827, 131, 102);
INSERT INTO public.package_tests VALUES (828, 131, 72);
INSERT INTO public.package_tests VALUES (829, 131, 113);
INSERT INTO public.package_tests VALUES (830, 131, 83);
INSERT INTO public.package_tests VALUES (831, 132, 15);
INSERT INTO public.package_tests VALUES (832, 132, 13);
INSERT INTO public.package_tests VALUES (833, 132, 11);
INSERT INTO public.package_tests VALUES (834, 132, 60);
INSERT INTO public.package_tests VALUES (835, 132, 90);
INSERT INTO public.package_tests VALUES (836, 132, 17);
INSERT INTO public.package_tests VALUES (837, 132, 18);
INSERT INTO public.package_tests VALUES (838, 132, 64);
INSERT INTO public.package_tests VALUES (839, 132, 2);
INSERT INTO public.package_tests VALUES (840, 132, 4);
INSERT INTO public.package_tests VALUES (841, 132, 5);
INSERT INTO public.package_tests VALUES (842, 132, 7);
INSERT INTO public.package_tests VALUES (843, 132, 6);
INSERT INTO public.package_tests VALUES (844, 132, 8);
INSERT INTO public.package_tests VALUES (845, 132, 24);
INSERT INTO public.package_tests VALUES (846, 132, 68);
INSERT INTO public.package_tests VALUES (847, 132, 25);
INSERT INTO public.package_tests VALUES (848, 132, 99);
INSERT INTO public.package_tests VALUES (849, 132, 69);
INSERT INTO public.package_tests VALUES (850, 132, 70);
INSERT INTO public.package_tests VALUES (851, 132, 100);
INSERT INTO public.package_tests VALUES (852, 132, 170);
INSERT INTO public.package_tests VALUES (853, 132, 102);
INSERT INTO public.package_tests VALUES (854, 132, 72);
INSERT INTO public.package_tests VALUES (855, 132, 113);
INSERT INTO public.package_tests VALUES (856, 132, 83);
INSERT INTO public.package_tests VALUES (857, 132, 101);
INSERT INTO public.package_tests VALUES (858, 132, 71);
INSERT INTO public.package_tests VALUES (903, 116, 16);
INSERT INTO public.package_tests VALUES (904, 116, 19);
INSERT INTO public.package_tests VALUES (936, 122, 126);
INSERT INTO public.package_tests VALUES (944, 123, 126);
INSERT INTO public.package_tests VALUES (948, 123, 67);
INSERT INTO public.package_tests VALUES (950, 124, 16);
INSERT INTO public.package_tests VALUES (951, 124, 19);
INSERT INTO public.package_tests VALUES (959, 125, 16);
INSERT INTO public.package_tests VALUES (960, 125, 19);
INSERT INTO public.package_tests VALUES (982, 127, 16);
INSERT INTO public.package_tests VALUES (983, 127, 19);
INSERT INTO public.package_tests VALUES (993, 128, 16);
INSERT INTO public.package_tests VALUES (994, 128, 19);
INSERT INTO public.package_tests VALUES (997, 129, 19);
INSERT INTO public.package_tests VALUES (1007, 130, 16);
INSERT INTO public.package_tests VALUES (1008, 130, 19);
INSERT INTO public.package_tests VALUES (1021, 131, 16);
INSERT INTO public.package_tests VALUES (1022, 131, 19);
INSERT INTO public.package_tests VALUES (1047, 132, 16);
INSERT INTO public.package_tests VALUES (1048, 132, 19);
INSERT INTO public.package_tests VALUES (1070, 1, 90);
INSERT INTO public.package_tests VALUES (1071, 1, 64);
INSERT INTO public.package_tests VALUES (1076, 2, 90);
INSERT INTO public.package_tests VALUES (1077, 2, 64);
INSERT INTO public.package_tests VALUES (1082, 3, 90);
INSERT INTO public.package_tests VALUES (1083, 3, 64);
INSERT INTO public.package_tests VALUES (1128, 122, 141);
INSERT INTO public.package_tests VALUES (1136, 123, 141);
INSERT INTO public.package_tests VALUES (1288, 116, 94);
INSERT INTO public.package_tests VALUES (1320, 122, 95);
INSERT INTO public.package_tests VALUES (1328, 123, 95);
INSERT INTO public.package_tests VALUES (1335, 124, 94);
INSERT INTO public.package_tests VALUES (1344, 125, 94);
INSERT INTO public.package_tests VALUES (1367, 127, 94);
INSERT INTO public.package_tests VALUES (1378, 128, 94);
INSERT INTO public.package_tests VALUES (1381, 129, 94);
INSERT INTO public.package_tests VALUES (1392, 130, 94);
INSERT INTO public.package_tests VALUES (1406, 131, 94);
INSERT INTO public.package_tests VALUES (1432, 132, 94);
INSERT INTO public.package_tests VALUES (1511, 122, 22);
INSERT INTO public.package_tests VALUES (1519, 123, 22);
INSERT INTO public.package_tests VALUES (1704, 122, 125);
INSERT INTO public.package_tests VALUES (1712, 123, 125);


--
-- TOC entry 5183 (class 0 OID 60590)
-- Dependencies: 232
-- Data for Name: packages; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.packages VALUES (115, 'Cancer Marker Gold Profile - Male', 'Comprehensive screen for key male oncology markers and core clinical checkups.', 'Cancer', true, '2026-05-28 16:06:53.094951', '2026-05-28 16:06:53.094951', 'Blood & Urine Specimen', 'Requires 10-12 hours of overnight fasting. Plain water is permitted.', '[{"body": "Tracks early indicators for standard chronic conditions before symptoms show.", "title": "Core Screening"}]', '[{"desc": "Covers vital metabolic benchmarks.", "name": "Whole Body Checkup", "strength": "100%"}]', '[{"a": "Digital reports are typically delivered via WhatsApp and email within 12 to 24 hours of sample collection.", "q": "How long does it take to get the package results?"}, {"a": "Yes, an 8 to 12 hour overnight fast is highly recommended for accurate results, especially for blood sugar and lipid profiles. You can drink plain water.", "q": "Is fasting mandatory for this package?"}, {"a": "Yes, free home sample collection is available for all premium diagnostic packages.", "q": "Is home collection free for this package?"}]');
INSERT INTO public.packages VALUES (116, 'Onco-Screen Female Plus', 'Premium oncology markers screening specifically designed for women.', 'Cancer', true, '2026-05-28 16:06:53.098786', '2026-05-28 16:06:53.098786', 'Blood & Urine Specimen', 'Requires 10-12 hours of overnight fasting. Plain water is permitted.', '[{"body": "Tracks early indicators for standard chronic conditions before symptoms show.", "title": "Core Screening"}]', '[{"desc": "Covers vital metabolic benchmarks.", "name": "Whole Body Checkup", "strength": "100%"}]', '[{"a": "Digital reports are typically delivered via WhatsApp and email within 12 to 24 hours of sample collection.", "q": "How long does it take to get the package results?"}, {"a": "Yes, an 8 to 12 hour overnight fast is highly recommended for accurate results, especially for blood sugar and lipid profiles. You can drink plain water.", "q": "Is fasting mandatory for this package?"}, {"a": "Yes, free home sample collection is available for all premium diagnostic packages.", "q": "Is home collection free for this package?"}]');
INSERT INTO public.packages VALUES (117, 'Essential Cancer Screening - Male', 'Basic screening markers for male cancer risk auditing.', 'Cancer', true, '2026-05-28 16:06:53.102628', '2026-05-28 16:06:53.102628', 'Blood & Urine Specimen', 'Requires 10-12 hours of overnight fasting. Plain water is permitted.', '[{"body": "Tracks early indicators for standard chronic conditions before symptoms show.", "title": "Core Screening"}]', '[{"desc": "Covers vital metabolic benchmarks.", "name": "Whole Body Checkup", "strength": "100%"}]', '[{"a": "Digital reports are typically delivered via WhatsApp and email within 12 to 24 hours of sample collection.", "q": "How long does it take to get the package results?"}, {"a": "Yes, an 8 to 12 hour overnight fast is highly recommended for accurate results, especially for blood sugar and lipid profiles. You can drink plain water.", "q": "Is fasting mandatory for this package?"}, {"a": "Yes, free home sample collection is available for all premium diagnostic packages.", "q": "Is home collection free for this package?"}]');
INSERT INTO public.packages VALUES (123, 'HbA1c & Glucose Level Monitor', 'Regular diabetic glycemic control screen for monthly/quarterly tracking.', 'Diabetes', true, '2026-05-28 16:06:53.113209', '2026-05-28 16:06:53.113209', 'Blood & Urine Specimen', 'Requires 10-12 hours of overnight fasting. Plain water is permitted.', '[{"body": "Tracks early indicators for standard chronic conditions before symptoms show.", "title": "Core Screening"}]', '[{"desc": "Covers vital metabolic benchmarks.", "name": "Whole Body Checkup", "strength": "100%"}]', '[{"a": "Digital reports are typically delivered via WhatsApp and email within 12 to 24 hours of sample collection.", "q": "How long does it take to get the package results?"}, {"a": "Yes, an 8 to 12 hour overnight fast is highly recommended for accurate results, especially for blood sugar and lipid profiles. You can drink plain water.", "q": "Is fasting mandatory for this package?"}, {"a": "Yes, free home sample collection is available for all premium diagnostic packages.", "q": "Is home collection free for this package?"}]');
INSERT INTO public.packages VALUES (124, 'PCOS Health Screening', 'Hormonal profile specifically curated for PCOS and metabolic tracking.', 'Pregnancy', true, '2026-05-28 16:06:53.115563', '2026-05-28 16:06:53.115563', 'Blood & Urine Specimen', 'Requires 10-12 hours of overnight fasting. Plain water is permitted.', '[{"body": "Tracks early indicators for standard chronic conditions before symptoms show.", "title": "Core Screening"}]', '[{"desc": "Covers vital metabolic benchmarks.", "name": "Whole Body Checkup", "strength": "100%"}]', '[{"a": "Digital reports are typically delivered via WhatsApp and email within 12 to 24 hours of sample collection.", "q": "How long does it take to get the package results?"}, {"a": "Yes, an 8 to 12 hour overnight fast is highly recommended for accurate results, especially for blood sugar and lipid profiles. You can drink plain water.", "q": "Is fasting mandatory for this package?"}, {"a": "Yes, free home sample collection is available for all premium diagnostic packages.", "q": "Is home collection free for this package?"}]');
INSERT INTO public.packages VALUES (119, 'Healthy Heart Gold Profile', 'Complete heart health panel assessing key cardiac indicators and lipid fractions.', 'Heart', true, '2026-05-28 16:06:53.106031', '2026-05-28 16:06:53.106031', 'Blood & Urine Specimen', 'Requires 10-12 hours of overnight fasting. Plain water is permitted.', '[{"body": "Tracks early indicators for standard chronic conditions before symptoms show.", "title": "Core Screening"}]', '[{"desc": "Covers vital metabolic benchmarks.", "name": "Whole Body Checkup", "strength": "100%"}]', '[{"a": "Digital reports are typically delivered via WhatsApp and email within 12 to 24 hours of sample collection.", "q": "How long does it take to get the package results?"}, {"a": "Yes, an 8 to 12 hour overnight fast is highly recommended for accurate results, especially for blood sugar and lipid profiles. You can drink plain water.", "q": "Is fasting mandatory for this package?"}, {"a": "Yes, free home sample collection is available for all premium diagnostic packages.", "q": "Is home collection free for this package?"}]');
INSERT INTO public.packages VALUES (120, 'Cardiac Risk Biomarker Panel', 'Specific cardiac risk indices including Hs-CRP, ApoA and ApoB levels.', 'Heart', true, '2026-05-28 16:06:53.107869', '2026-05-28 16:06:53.107869', 'Blood & Urine Specimen', 'Requires 10-12 hours of overnight fasting. Plain water is permitted.', '[{"body": "Tracks early indicators for standard chronic conditions before symptoms show.", "title": "Core Screening"}]', '[{"desc": "Covers vital metabolic benchmarks.", "name": "Whole Body Checkup", "strength": "100%"}]', '[{"a": "Digital reports are typically delivered via WhatsApp and email within 12 to 24 hours of sample collection.", "q": "How long does it take to get the package results?"}, {"a": "Yes, an 8 to 12 hour overnight fast is highly recommended for accurate results, especially for blood sugar and lipid profiles. You can drink plain water.", "q": "Is fasting mandatory for this package?"}, {"a": "Yes, free home sample collection is available for all premium diagnostic packages.", "q": "Is home collection free for this package?"}]');
INSERT INTO public.packages VALUES (121, 'Lipid Profile Advanced', 'Standard lipid panels with extended cardiovascular indicators.', 'Heart', true, '2026-05-28 16:06:53.109743', '2026-05-28 16:06:53.109743', 'Blood & Urine Specimen', 'Requires 10-12 hours of overnight fasting. Plain water is permitted.', '[{"body": "Tracks early indicators for standard chronic conditions before symptoms show.", "title": "Core Screening"}]', '[{"desc": "Covers vital metabolic benchmarks.", "name": "Whole Body Checkup", "strength": "100%"}]', '[{"a": "Digital reports are typically delivered via WhatsApp and email within 12 to 24 hours of sample collection.", "q": "How long does it take to get the package results?"}, {"a": "Yes, an 8 to 12 hour overnight fast is highly recommended for accurate results, especially for blood sugar and lipid profiles. You can drink plain water.", "q": "Is fasting mandatory for this package?"}, {"a": "Yes, free home sample collection is available for all premium diagnostic packages.", "q": "Is home collection free for this package?"}]');
INSERT INTO public.packages VALUES (122, 'Diabetes Comprehensive Care Package', 'Full system diabetic health check, including microalbuminuria and renal markers.', 'Diabetes', true, '2026-05-28 16:06:53.111381', '2026-05-28 16:06:53.111381', 'Blood & Urine Specimen', 'Requires 10-12 hours of overnight fasting. Plain water is permitted.', '[{"body": "Tracks early indicators for standard chronic conditions before symptoms show.", "title": "Core Screening"}]', '[{"desc": "Covers vital metabolic benchmarks.", "name": "Whole Body Checkup", "strength": "100%"}]', '[{"a": "Digital reports are typically delivered via WhatsApp and email within 12 to 24 hours of sample collection.", "q": "How long does it take to get the package results?"}, {"a": "Yes, an 8 to 12 hour overnight fast is highly recommended for accurate results, especially for blood sugar and lipid profiles. You can drink plain water.", "q": "Is fasting mandatory for this package?"}, {"a": "Yes, free home sample collection is available for all premium diagnostic packages.", "q": "Is home collection free for this package?"}]');
INSERT INTO public.packages VALUES (126, 'Senior Citizen Care Profile - Male', 'Geriatric-focused systemic checkup evaluating kidneys, bone health, and lipids.', 'Senior Citizen', true, '2026-05-28 16:06:53.118861', '2026-05-28 16:06:53.118861', 'Blood & Urine Specimen', 'Overnight fasting required for 10 to 12 hours. Do not consume alcohol 24 hours prior.', '[{"body": "Custom-designed for adults aged 60+ to evaluate systemic metabolic slowing and age-associated chronic conditions.", "title": "Geriatric Health Baseline"}, {"body": "Tracks artery clogging cholesterol ratios alongside bone mineral calcium retention to monitor stroke and fracture risks.", "title": "Cardio-Vascular & Bone Checks"}, {"body": "Checks renal clearance and electrolyte balances, which frequently fluctuate in older adults and impact cognitive function.", "title": "Dehydration & Kidney Auditing"}]', '[{"desc": "Measures serum calcium levels to track osteoporosis risk and joint health.", "name": "Bone Density & Calcium", "strength": "95%"}, {"desc": "BUN, Creatinine, and Urea checks to track hydration and kidney age.", "name": "Kidney Health & Clearance", "strength": "100%"}, {"desc": "Lipid screening to evaluate stroke and cardiovascular artery blocks.", "name": "Heart & Artery Integrity", "strength": "90%"}, {"desc": "CBC screens for geriatric anemia, chronic inflammation, and immune strength.", "name": "Blood Composition", "strength": "100%"}, {"desc": "LFT screening to track liver enzyme health and toxic chemical filtering.", "name": "Liver Waste Filtering", "strength": "95%"}, {"desc": "HbA1c & Fasting glucose tracks average long-term insulin efficiency.", "name": "Diabetes & Sugar Control", "strength": "100%"}]', '[{"a": "Digital reports are typically delivered via WhatsApp and email within 12 to 24 hours of sample collection.", "q": "How long does it take to get the package results?"}, {"a": "Yes, an 8 to 12 hour overnight fast is highly recommended for accurate results, especially for blood sugar and lipid profiles. You can drink plain water.", "q": "Is fasting mandatory for this package?"}, {"a": "Yes, free home sample collection is available for all premium diagnostic packages.", "q": "Is home collection free for this package?"}]');
INSERT INTO public.packages VALUES (129, 'Thyroid Autoimmune Auto-antibody Screen', 'Autoimmune thyroid condition audit checking Anti-TPO antibodies.', 'Thyroid', true, '2026-05-28 16:06:53.124108', '2026-05-28 16:06:53.124108', 'Blood & Urine Specimen', 'Requires 10-12 hours of overnight fasting. Plain water is permitted.', '[{"body": "Tracks early indicators for standard chronic conditions before symptoms show.", "title": "Core Screening"}]', '[{"desc": "Covers vital metabolic benchmarks.", "name": "Whole Body Checkup", "strength": "100%"}]', '[{"a": "Digital reports are typically delivered via WhatsApp and email within 12 to 24 hours of sample collection.", "q": "How long does it take to get the package results?"}, {"a": "Yes, an 8 to 12 hour overnight fast is highly recommended for accurate results, especially for blood sugar and lipid profiles. You can drink plain water.", "q": "Is fasting mandatory for this package?"}, {"a": "Yes, free home sample collection is available for all premium diagnostic packages.", "q": "Is home collection free for this package?"}]');
INSERT INTO public.packages VALUES (128, 'Thyroid Hormone Gold Profile', 'Standard thyroid profile evaluating active metabolic activation (T3, T4, TSH).', 'Thyroid', true, '2026-05-28 16:06:53.122369', '2026-05-28 16:06:53.122369', 'Blood & Urine Specimen', 'Requires 10-12 hours of overnight fasting. Plain water is permitted.', '[{"body": "Tracks early indicators for standard chronic conditions before symptoms show.", "title": "Core Screening"}]', '[{"desc": "Covers vital metabolic benchmarks.", "name": "Whole Body Checkup", "strength": "100%"}]', '[{"a": "Digital reports are typically delivered via WhatsApp and email within 12 to 24 hours of sample collection.", "q": "How long does it take to get the package results?"}, {"a": "Yes, an 8 to 12 hour overnight fast is highly recommended for accurate results, especially for blood sugar and lipid profiles. You can drink plain water.", "q": "Is fasting mandatory for this package?"}, {"a": "Yes, free home sample collection is available for all premium diagnostic packages.", "q": "Is home collection free for this package?"}]');
INSERT INTO public.packages VALUES (130, 'Essential Full Body Checkup (64 Tests)', 'Core preventive health baseline checking heart, liver, kidneys, and blood.', 'Full Body Checkup', true, '2026-05-28 16:06:53.125878', '2026-05-28 16:06:53.125878', 'Blood & Urine Specimen', 'Requires 10-12 hours of strict overnight fasting. Water is permitted.', '[{"body": "Checks 64 critical markers across heart, liver, kidneys, blood, and thyroid systems to establish a baseline health score.", "title": "Full System Screening"}, {"body": "Screens for pre-diabetes, high cholesterol, liver fatty changes, and chronic inflammation before any physical symptoms manifest.", "title": "Early Detection of Silent Killers"}, {"body": "Provides concrete biochemical feedback on your sleep, diet, stress, and exercise impacts to help customize your wellness roadmap.", "title": "Preventative Lifestyle Auditing"}]', '[{"desc": "Evaluates lipid profiles, LDL/HDL ratio, and triglycerides for coronary risk tracking.", "name": "Cardiovascular Health", "strength": "95%"}, {"desc": "LFT checks enzymes like SGOT/SGPT, albumin, and total bilirubin.", "name": "Hepatic Metabolic Output", "strength": "100%"}, {"desc": "KFT measures creatinine, blood urea nitrogen, and waste clearance.", "name": "Renal Filtration Rate", "strength": "90%"}, {"desc": "TSH checks metabolic activation levels for hypothyroidism tracking.", "name": "Thyroid Speed (TSH)", "strength": "100%"}, {"desc": "CBC counts red/white cells, hemoglobin level, and platelet values.", "name": "Hematological Vitality", "strength": "100%"}, {"desc": "Fasting blood sugar tracks average insulin regularities and glucose levels.", "name": "Glycemic Control Index", "strength": "95%"}]', '[{"a": "Digital reports are typically delivered via WhatsApp and email within 12 to 24 hours of sample collection.", "q": "How long does it take to get the package results?"}, {"a": "Yes, an 8 to 12 hour overnight fast is highly recommended for accurate results, especially for blood sugar and lipid profiles. You can drink plain water.", "q": "Is fasting mandatory for this package?"}, {"a": "Yes, free home sample collection is available for all premium diagnostic packages.", "q": "Is home collection free for this package?"}]');
INSERT INTO public.packages VALUES (3, 'Women''s Wellness Package', 'Diagnostic laboratory test for medical evaluation.', 'package', true, '2026-05-25 21:24:54.860996', '2026-05-25 21:24:54.860996', 'Blood & Urine Specimen', 'Requires overnight fasting for 8 to 10 hours. Best scheduled 5-10 days after menstrual cycle.', '[{"body": "Tracks TSH, bone density minerals, and blood counts to screen for thyroid disorders and hormonal imbalances common in women.", "title": "Hormonal & Thyroid Balance"}, {"body": "Evaluates hemoglobin, ferritin, and iron indexes to detect hidden chronic anemia or heavy-cycle iron loss.", "title": "Anemia & Iron Store Screening"}, {"body": "Measures kidney and liver filtration capacity alongside lipid indexes to screen for metabolic syndrome risk.", "title": "Immunity & Metabolic Health"}]', '[{"desc": "Hemoglobin and iron profiles to diagnose fatigue and blood health.", "name": "Anemia & Iron Levels", "strength": "100%"}, {"desc": "Measures TSH to monitor weight changes, energy, and hormonal speed.", "name": "Thyroid Stimulation", "strength": "95%"}, {"desc": "Cholesterol, triglycerides, and HDL/LDL ratio screening.", "name": "Heart Risk (Lipids)", "strength": "90%"}, {"desc": "Tracks calcium levels to screen for osteopenia and bone thinning.", "name": "Bone Mineral Retention", "strength": "100%"}, {"desc": "KFT screens for uric acid, hydration levels, and waste filtration.", "name": "Kidney Filtration", "strength": "95%"}, {"desc": "LFT checks enzymes and proteins to monitor detox capacity.", "name": "Liver Performance", "strength": "95%"}]', '[{"a": "Digital reports are typically delivered via WhatsApp and email within 12 to 24 hours of sample collection.", "q": "How long does it take to get the package results?"}, {"a": "Yes, an 8 to 12 hour overnight fast is highly recommended for accurate results, especially for blood sugar and lipid profiles. You can drink plain water.", "q": "Is fasting mandatory for this package?"}, {"a": "Yes, free home sample collection is available for all premium diagnostic packages.", "q": "Is home collection free for this package?"}]');
INSERT INTO public.packages VALUES (118, 'Essential Cancer Screening - Female', 'Basic screening markers for female cancer risk auditing.', 'Cancer', true, '2026-05-28 16:06:53.104559', '2026-05-28 16:06:53.104559', 'Blood & Urine Specimen', 'Requires 10-12 hours of overnight fasting. Plain water is permitted.', '[{"body": "Tracks early indicators for standard chronic conditions before symptoms show.", "title": "Core Screening"}]', '[{"desc": "Covers vital metabolic benchmarks.", "name": "Whole Body Checkup", "strength": "100%"}]', '[{"a": "Digital reports are typically delivered via WhatsApp and email within 12 to 24 hours of sample collection.", "q": "How long does it take to get the package results?"}, {"a": "Yes, an 8 to 12 hour overnight fast is highly recommended for accurate results, especially for blood sugar and lipid profiles. You can drink plain water.", "q": "Is fasting mandatory for this package?"}, {"a": "Yes, free home sample collection is available for all premium diagnostic packages.", "q": "Is home collection free for this package?"}]');
INSERT INTO public.packages VALUES (125, 'Hormonal Balance Profile', 'Core hormonal health profile assessing thyroid, estrogen, and blood counts.', 'Pregnancy', true, '2026-05-28 16:06:53.11731', '2026-05-28 16:06:53.11731', 'Blood & Urine Specimen', 'Requires 10-12 hours of overnight fasting. Plain water is permitted.', '[{"body": "Tracks early indicators for standard chronic conditions before symptoms show.", "title": "Core Screening"}]', '[{"desc": "Covers vital metabolic benchmarks.", "name": "Whole Body Checkup", "strength": "100%"}]', '[{"a": "Digital reports are typically delivered via WhatsApp and email within 12 to 24 hours of sample collection.", "q": "How long does it take to get the package results?"}, {"a": "Yes, an 8 to 12 hour overnight fast is highly recommended for accurate results, especially for blood sugar and lipid profiles. You can drink plain water.", "q": "Is fasting mandatory for this package?"}, {"a": "Yes, free home sample collection is available for all premium diagnostic packages.", "q": "Is home collection free for this package?"}]');
INSERT INTO public.packages VALUES (127, 'Senior Citizen Care Profile - Female', 'Geriatric-focused systemic checkup with bone-density and female hormonal checks.', 'Senior Citizen', true, '2026-05-28 16:06:53.120445', '2026-05-28 16:06:53.120445', 'Blood & Urine Specimen', 'Overnight fasting required for 10 to 12 hours. Do not consume alcohol 24 hours prior.', '[{"body": "Custom-designed for adults aged 60+ to evaluate systemic metabolic slowing and age-associated chronic conditions.", "title": "Geriatric Health Baseline"}, {"body": "Tracks artery clogging cholesterol ratios alongside bone mineral calcium retention to monitor stroke and fracture risks.", "title": "Cardio-Vascular & Bone Checks"}, {"body": "Checks renal clearance and electrolyte balances, which frequently fluctuate in older adults and impact cognitive function.", "title": "Dehydration & Kidney Auditing"}]', '[{"desc": "Measures serum calcium levels to track osteoporosis risk and joint health.", "name": "Bone Density & Calcium", "strength": "95%"}, {"desc": "BUN, Creatinine, and Urea checks to track hydration and kidney age.", "name": "Kidney Health & Clearance", "strength": "100%"}, {"desc": "Lipid screening to evaluate stroke and cardiovascular artery blocks.", "name": "Heart & Artery Integrity", "strength": "90%"}, {"desc": "CBC screens for geriatric anemia, chronic inflammation, and immune strength.", "name": "Blood Composition", "strength": "100%"}, {"desc": "LFT screening to track liver enzyme health and toxic chemical filtering.", "name": "Liver Waste Filtering", "strength": "95%"}, {"desc": "HbA1c & Fasting glucose tracks average long-term insulin efficiency.", "name": "Diabetes & Sugar Control", "strength": "100%"}]', '[{"a": "Digital reports are typically delivered via WhatsApp and email within 12 to 24 hours of sample collection.", "q": "How long does it take to get the package results?"}, {"a": "Yes, an 8 to 12 hour overnight fast is highly recommended for accurate results, especially for blood sugar and lipid profiles. You can drink plain water.", "q": "Is fasting mandatory for this package?"}, {"a": "Yes, free home sample collection is available for all premium diagnostic packages.", "q": "Is home collection free for this package?"}]');
INSERT INTO public.packages VALUES (131, 'Advanced Full Body Checkup (85 Tests)', 'Comprehensive wellness checkup including vital vitamin profiles.', 'Full Body Checkup', true, '2026-05-28 16:06:53.127141', '2026-05-28 16:06:53.127141', 'Blood & Urine Specimen', 'Requires 10-12 hours of strict overnight fasting. Water is permitted.', '[{"body": "Checks 64 critical markers across heart, liver, kidneys, blood, and thyroid systems to establish a baseline health score.", "title": "Full System Screening"}, {"body": "Screens for pre-diabetes, high cholesterol, liver fatty changes, and chronic inflammation before any physical symptoms manifest.", "title": "Early Detection of Silent Killers"}, {"body": "Provides concrete biochemical feedback on your sleep, diet, stress, and exercise impacts to help customize your wellness roadmap.", "title": "Preventative Lifestyle Auditing"}]', '[{"desc": "Evaluates lipid profiles, LDL/HDL ratio, and triglycerides for coronary risk tracking.", "name": "Cardiovascular Health", "strength": "95%"}, {"desc": "LFT checks enzymes like SGOT/SGPT, albumin, and total bilirubin.", "name": "Hepatic Metabolic Output", "strength": "100%"}, {"desc": "KFT measures creatinine, blood urea nitrogen, and waste clearance.", "name": "Renal Filtration Rate", "strength": "90%"}, {"desc": "TSH checks metabolic activation levels for hypothyroidism tracking.", "name": "Thyroid Speed (TSH)", "strength": "100%"}, {"desc": "CBC counts red/white cells, hemoglobin level, and platelet values.", "name": "Hematological Vitality", "strength": "100%"}, {"desc": "Fasting blood sugar tracks average insulin regularities and glucose levels.", "name": "Glycemic Control Index", "strength": "95%"}]', '[{"a": "Digital reports are typically delivered via WhatsApp and email within 12 to 24 hours of sample collection.", "q": "How long does it take to get the package results?"}, {"a": "Yes, an 8 to 12 hour overnight fast is highly recommended for accurate results, especially for blood sugar and lipid profiles. You can drink plain water.", "q": "Is fasting mandatory for this package?"}, {"a": "Yes, free home sample collection is available for all premium diagnostic packages.", "q": "Is home collection free for this package?"}]');
INSERT INTO public.packages VALUES (1, 'Full Body Health Checkup (64 Tests)', 'Comprehensive screening for various vital health parameters.', 'package', true, '2026-05-25 21:24:54.860996', '2026-05-25 21:24:54.860996', 'Blood & Urine Specimen', 'Requires 10-12 hours of strict overnight fasting. Water is permitted.', '[{"body": "Checks 64 critical markers across heart, liver, kidneys, blood, and thyroid systems to establish a baseline health score.", "title": "Full System Screening"}, {"body": "Screens for pre-diabetes, high cholesterol, liver fatty changes, and chronic inflammation before any physical symptoms manifest.", "title": "Early Detection of Silent Killers"}, {"body": "Provides concrete biochemical feedback on your sleep, diet, stress, and exercise impacts to help customize your wellness roadmap.", "title": "Preventative Lifestyle Auditing"}]', '[{"desc": "Evaluates lipid profiles, LDL/HDL ratio, and triglycerides for coronary risk tracking.", "name": "Cardiovascular Health", "strength": "95%"}, {"desc": "LFT checks enzymes like SGOT/SGPT, albumin, and total bilirubin.", "name": "Hepatic Metabolic Output", "strength": "100%"}, {"desc": "KFT measures creatinine, blood urea nitrogen, and waste clearance.", "name": "Renal Filtration Rate", "strength": "90%"}, {"desc": "TSH checks metabolic activation levels for hypothyroidism tracking.", "name": "Thyroid Speed (TSH)", "strength": "100%"}, {"desc": "CBC counts red/white cells, hemoglobin level, and platelet values.", "name": "Hematological Vitality", "strength": "100%"}, {"desc": "Fasting blood sugar tracks average insulin regularities and glucose levels.", "name": "Glycemic Control Index", "strength": "95%"}]', '[{"a": "Digital reports are typically delivered via WhatsApp and email within 12 to 24 hours of sample collection.", "q": "How long does it take to get the package results?"}, {"a": "Yes, an 8 to 12 hour overnight fast is highly recommended for accurate results, especially for blood sugar and lipid profiles. You can drink plain water.", "q": "Is fasting mandatory for this package?"}, {"a": "Yes, free home sample collection is available for all premium diagnostic packages.", "q": "Is home collection free for this package?"}]');
INSERT INTO public.packages VALUES (2, 'Senior Citizen Package', 'Diagnostic laboratory test for medical evaluation.', 'package', true, '2026-05-25 21:24:54.860996', '2026-05-25 21:24:54.860996', 'Blood & Urine Specimen', 'Overnight fasting required for 10 to 12 hours. Do not consume alcohol 24 hours prior.', '[{"body": "Custom-designed for adults aged 60+ to evaluate systemic metabolic slowing and age-associated chronic conditions.", "title": "Geriatric Health Baseline"}, {"body": "Tracks artery clogging cholesterol ratios alongside bone mineral calcium retention to monitor stroke and fracture risks.", "title": "Cardio-Vascular & Bone Checks"}, {"body": "Checks renal clearance and electrolyte balances, which frequently fluctuate in older adults and impact cognitive function.", "title": "Dehydration & Kidney Auditing"}]', '[{"desc": "Measures serum calcium levels to track osteoporosis risk and joint health.", "name": "Bone Density & Calcium", "strength": "95%"}, {"desc": "BUN, Creatinine, and Urea checks to track hydration and kidney age.", "name": "Kidney Health & Clearance", "strength": "100%"}, {"desc": "Lipid screening to evaluate stroke and cardiovascular artery blocks.", "name": "Heart & Artery Integrity", "strength": "90%"}, {"desc": "CBC screens for geriatric anemia, chronic inflammation, and immune strength.", "name": "Blood Composition", "strength": "100%"}, {"desc": "LFT screening to track liver enzyme health and toxic chemical filtering.", "name": "Liver Waste Filtering", "strength": "95%"}, {"desc": "HbA1c & Fasting glucose tracks average long-term insulin efficiency.", "name": "Diabetes & Sugar Control", "strength": "100%"}]', '[{"a": "Digital reports are typically delivered via WhatsApp and email within 12 to 24 hours of sample collection.", "q": "How long does it take to get the package results?"}, {"a": "Yes, an 8 to 12 hour overnight fast is highly recommended for accurate results, especially for blood sugar and lipid profiles. You can drink plain water.", "q": "Is fasting mandatory for this package?"}, {"a": "Yes, free home sample collection is available for all premium diagnostic packages.", "q": "Is home collection free for this package?"}]');
INSERT INTO public.packages VALUES (132, 'Executive Full Body Checkup (120 Tests)', 'Elite whole-body metabolic panel with heavy metals and diagnostic indices.', 'Full Body Checkup', true, '2026-05-28 16:06:53.128751', '2026-05-28 16:06:53.128751', 'Blood & Urine Specimen', 'Requires 10-12 hours of strict overnight fasting. Water is permitted.', '[{"body": "Checks 64 critical markers across heart, liver, kidneys, blood, and thyroid systems to establish a baseline health score.", "title": "Full System Screening"}, {"body": "Screens for pre-diabetes, high cholesterol, liver fatty changes, and chronic inflammation before any physical symptoms manifest.", "title": "Early Detection of Silent Killers"}, {"body": "Provides concrete biochemical feedback on your sleep, diet, stress, and exercise impacts to help customize your wellness roadmap.", "title": "Preventative Lifestyle Auditing"}]', '[{"desc": "Evaluates lipid profiles, LDL/HDL ratio, and triglycerides for coronary risk tracking.", "name": "Cardiovascular Health", "strength": "95%"}, {"desc": "LFT checks enzymes like SGOT/SGPT, albumin, and total bilirubin.", "name": "Hepatic Metabolic Output", "strength": "100%"}, {"desc": "KFT measures creatinine, blood urea nitrogen, and waste clearance.", "name": "Renal Filtration Rate", "strength": "90%"}, {"desc": "TSH checks metabolic activation levels for hypothyroidism tracking.", "name": "Thyroid Speed (TSH)", "strength": "100%"}, {"desc": "CBC counts red/white cells, hemoglobin level, and platelet values.", "name": "Hematological Vitality", "strength": "100%"}, {"desc": "Fasting blood sugar tracks average insulin regularities and glucose levels.", "name": "Glycemic Control Index", "strength": "95%"}]', '[{"a": "Digital reports are typically delivered via WhatsApp and email within 12 to 24 hours of sample collection.", "q": "How long does it take to get the package results?"}, {"a": "Yes, an 8 to 12 hour overnight fast is highly recommended for accurate results, especially for blood sugar and lipid profiles. You can drink plain water.", "q": "Is fasting mandatory for this package?"}, {"a": "Yes, free home sample collection is available for all premium diagnostic packages.", "q": "Is home collection free for this package?"}]');


--
-- TOC entry 5193 (class 0 OID 76909)
-- Dependencies: 242
-- Data for Name: packages_landing_categories; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.packages_landing_categories VALUES (1, 'Full Body Checkup', '120+ Tests included', 999, 42, 'health_and_safety', 'primary', true, 0);
INSERT INTO public.packages_landing_categories VALUES (2, 'Heart Screening', 'Cardiac profiles', 1499, 28, 'favorite', 'error', true, 1);
INSERT INTO public.packages_landing_categories VALUES (3, 'Diabetes Monitoring', 'HbA1c & Glucose', 499, 56, 'bloodtype', 'secondary', true, 2);
INSERT INTO public.packages_landing_categories VALUES (4, 'Women Wellness', 'Hormonal & PCOD', 1299, 35, 'woman', 'tertiary', true, 3);
INSERT INTO public.packages_landing_categories VALUES (5, 'Senior Citizen', 'Comprehensive Care', 1999, 20, 'elderly', 'surface-highest', true, 4);
INSERT INTO public.packages_landing_categories VALUES (6, 'Thyroid Packages', 'T3, T4, TSH', 349, 60, 'biotech', 'surface-dim', true, 5);
INSERT INTO public.packages_landing_categories VALUES (7, 'Cancer Screening', 'Early Tumor Markers', 1499, 24, 'clinical_notes', 'tertiary', true, 6);


--
-- TOC entry 5197 (class 0 OID 76939)
-- Dependencies: 246
-- Data for Name: packages_landing_faqs; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.packages_landing_faqs VALUES (1, 'Are the prices on ChooseMyLab guaranteed?', 'Yes, the prices shown are finalized negotiated rates with our lab partners. You won''t have to pay anything extra at the lab or to the phlebotomist.', true, 0);
INSERT INTO public.packages_landing_faqs VALUES (2, 'How do I get my reports?', 'Reports are sent via email and WhatsApp once the lab completes the analysis. You can also download them from your ChooseMyLab dashboard.', true, 1);
INSERT INTO public.packages_landing_faqs VALUES (3, 'What if I need to cancel or reschedule?', 'Cancellations are free up to 2 hours before the scheduled collection time. You can easily reschedule from your booking panel.', true, 2);


--
-- TOC entry 5199 (class 0 OID 76952)
-- Dependencies: 248
-- Data for Name: packages_landing_partners; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.packages_landing_partners VALUES (1, 'Dr Lal PathLabs', 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=200&q=80', true, 0);
INSERT INTO public.packages_landing_partners VALUES (2, 'Thyrocare', 'https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=200&q=80', true, 1);
INSERT INTO public.packages_landing_partners VALUES (3, 'Redcliffe Labs', 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=200&q=80', true, 2);
INSERT INTO public.packages_landing_partners VALUES (4, 'Metropolis', 'https://images.unsplash.com/photo-1579684389782-64d84b5e9053?w=200&q=80', true, 3);
INSERT INTO public.packages_landing_partners VALUES (5, 'Apollo Diagnostics', 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=200&q=80', true, 4);


--
-- TOC entry 5195 (class 0 OID 76920)
-- Dependencies: 244
-- Data for Name: packages_landing_popular; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.packages_landing_popular VALUES (2, 'Advanced Checkup', 'Comprehensive metabolic screening', 'Cardiac markers, Iron, Thyroid + 85 tests', 2199, 4200, 8, 'Popular', 'https://images.unsplash.com/photo-1579684389782-64d84b5e9053?w=600&q=80', false, true, 1, NULL);
INSERT INTO public.packages_landing_popular VALUES (3, 'Executive Plus', 'Most Comprehensive', 'Cancer markers, Heavy metals + 120 tests', 4999, 8500, 5, 'Most Comprehensive', 'https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=600&q=80', true, true, 2, NULL);
INSERT INTO public.packages_landing_popular VALUES (4, 'Diabetes Advanced', 'Targeted glucose & cardiac panel', 'HbA1c, Microalbumin + Lipid profile', 1499, 2800, 22, 'Targeted Care', 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=600&q=80', false, true, 3, NULL);
INSERT INTO public.packages_landing_popular VALUES (1, 'Essential Full Body', 'Best Value', 'Includes Vitamin D, B12, CBC + 60 more', 1299, 2499, 12, 'Best Value', 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80', false, true, 0, 130);


--
-- TOC entry 5207 (class 0 OID 77000)
-- Dependencies: 256
-- Data for Name: packages_listing_faqs; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.packages_listing_faqs VALUES (5, 'Heart', 'What is Hs-CRP and why is it included?', 'Hs-CRP measures low-level vascular inflammation. Even if cholesterol is normal, high Hs-CRP indicates a cardiac risk.', 1);
INSERT INTO public.packages_listing_faqs VALUES (6, 'Heart', 'How long do reports take?', 'Reports are sent electronically within 12 to 18 hours of blood collection.', 2);
INSERT INTO public.packages_listing_faqs VALUES (7, 'Diabetes', 'What is the difference between Fasting Glucose and HbA1c?', 'Fasting glucose shows blood sugar at that exact second. HbA1c shows the stable average of the past 90 days.', 0);
INSERT INTO public.packages_listing_faqs VALUES (8, 'Diabetes', 'How frequently should a pre-diabetic get tested?', 'Pre-diabetics should monitor their HbA1c every 3 to 6 months to track if lifestyle corrections are successfully reversing the trend.', 1);
INSERT INTO public.packages_listing_faqs VALUES (9, 'Diabetes', 'Is fasting required for HbA1c alone?', 'Fasting is not required for a standalone HbA1c test. However, if your package includes Fasting Sugar or Lipids, you must fast.', 2);
INSERT INTO public.packages_listing_faqs VALUES (10, 'Pregnancy', 'When is the best time to take a hormonal profile?', 'Basic wellness checkups can be taken anytime. For specific fertility screens (like FSH, LH), it is best scheduled during day 2-5 of your cycle.', 0);
INSERT INTO public.packages_listing_faqs VALUES (11, 'Pregnancy', 'Is fasting required for female packages?', 'Fasting is recommended for 8 to 10 hours if the package includes lipid profiles or fasting sugar, which most of our panels do.', 1);
INSERT INTO public.packages_listing_faqs VALUES (12, 'Pregnancy', 'How do bone markers help?', 'Estrogen reductions over time affect calcium absorption. Tracking calcium and Vitamin D allows for timely therapeutic supplementation.', 2);
INSERT INTO public.packages_listing_faqs VALUES (13, 'Senior Citizen', 'Can senior citizen samples be collected at home?', 'Yes, we specialize in free home collection with highly trained geriatric phlebotomists who use extra-fine needles for delicate veins.', 0);
INSERT INTO public.packages_listing_faqs VALUES (14, 'Senior Citizen', 'Is fasting mandatory for older adults?', 'Fasting for 10 hours is ideal. If a senior is prone to low blood sugar (hypoglycemia), please carry a light snack for immediately after.', 1);
INSERT INTO public.packages_listing_faqs VALUES (1, 'Cancer', 'Whats typically included in a cancer screening package?', 'Our packages typically include a combination of Tumor Markers (like PSA, CEA, CA 125), Complete Blood Count (CBC) with differential, Metabolic panels, and specific organ function tests (Liver, Kidney).', 0);
INSERT INTO public.packages_listing_faqs VALUES (2, 'Cancer', 'Who should consider these packages?', 'They are recommended for adults over 35, individuals with a family history of cancer, long-term smokers, or those exposed to environmental toxins.', 1);
INSERT INTO public.packages_listing_faqs VALUES (3, 'Cancer', 'How often should I get screened?', 'For preventive health, an annual screening is generally recommended. Consult with a physician for a personalized schedule.', 2);
INSERT INTO public.packages_listing_faqs VALUES (4, 'Heart', 'Is fasting mandatory for cardiac packages?', 'Yes, a strict 10-12 hours overnight fast is mandatory because lipid ratios and triglycerides can fluctuate after meals. Plain water is permitted.', 0);
INSERT INTO public.packages_listing_faqs VALUES (18, 'Thyroid', 'What is an autoimmune thyroid screen?', 'Autoimmune screens (like Anti-TPO) check if thyroid sluggishness is due to Hashimotos thyroiditis, where your body attacks the gland.', 2);
INSERT INTO public.packages_listing_faqs VALUES (19, 'Full Body Checkup', 'What is included in a Full Body Checkup?', 'Our packages combine Complete Blood Count (CBC), Liver Panel (LFT), Kidney Panel (KFT), Lipid Profile (Heart), Thyroid Profile, Blood Sugar, Urine examination, and vital Vitamins.', 0);
INSERT INTO public.packages_listing_faqs VALUES (20, 'Full Body Checkup', 'Is home collection really free?', 'Yes, we provide free home sample collection across all areas. A certified clinical phlebotomist will handle the draw at your selected slot.', 1);
INSERT INTO public.packages_listing_faqs VALUES (21, 'Full Body Checkup', 'How should I prepare for a Full Body Checkup?', 'Fast for 10 to 12 hours overnight. Avoid alcohol and extreme physical exercise 24 hours prior. Plain water is permitted.', 2);
INSERT INTO public.packages_listing_faqs VALUES (15, 'Senior Citizen', 'Are reports elder-friendly?', 'Yes, our digital dashboard presents results in high-contrast oversized fonts with simplified green/red indicators for instant understanding.', 2);
INSERT INTO public.packages_listing_faqs VALUES (16, 'Thyroid', 'Should I take my thyroid medicine before blood collection?', 'No. Give your blood sample in the morning before consuming your daily thyroid hormone pill, as taking it beforehand will falsely elevate blood levels.', 0);
INSERT INTO public.packages_listing_faqs VALUES (17, 'Thyroid', 'Is fasting required for thyroid tests?', 'Fasting is not required for a standalone Thyroid panel. Morning tests are preferred as TSH has minor diurnal variation.', 1);


--
-- TOC entry 5205 (class 0 OID 76988)
-- Dependencies: 254
-- Data for Name: packages_listing_guides; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.packages_listing_guides VALUES (1, 'Cancer', 'Tumor Markers', 'Blood tests that look for proteins or substances made by cancer cells. Essential for initial screening.', 'detection_and_zone', 0);
INSERT INTO public.packages_listing_guides VALUES (2, 'Cancer', 'Genetic Predisposition', 'Advanced screening that analyzes specific genes linked to hereditary cancer risks like BRCA1/BRCA2.', 'genetics', 1);
INSERT INTO public.packages_listing_guides VALUES (3, 'Cancer', 'Systemic Impact', 'Comprehensive profiles that include organ function tests to see how the whole body is performing.', 'monitor_heart', 2);
INSERT INTO public.packages_listing_guides VALUES (4, 'Heart', 'Atherogenic Lipids', 'Measures sub-fractions like ApoB and ApoA1 to evaluate deep arterial clogging tendencies.', 'water_drop', 0);
INSERT INTO public.packages_listing_guides VALUES (5, 'Heart', 'Cardiac Markers', 'High-sensitivity CRP (Hs-CRP) checks for vascular wall inflammation, a primary trigger for cardiac events.', 'clinical_notes', 1);
INSERT INTO public.packages_listing_guides VALUES (6, 'Heart', 'Electro-Metabolic Panel', 'Integrates essential electrolytes (Sodium, Potassium) to ensure proper cardiac electrical conduction rhythm.', 'speed', 2);
INSERT INTO public.packages_listing_guides VALUES (7, 'Diabetes', 'Average Glycemia', 'HbA1c provides a stable 3-month sugar storage index, unaffected by short-term dietary slips.', 'analytics', 0);
INSERT INTO public.packages_listing_guides VALUES (8, 'Diabetes', 'Kidney Leakage Check', 'Microalbuminuria checks if kidneys are leaking microscopic protein, a primary sign of diabetic nephropathy.', 'verified_user', 1);
INSERT INTO public.packages_listing_guides VALUES (9, 'Diabetes', 'Lipid Coordination', 'Uncontrolled blood sugar alters lipid profiles, increasing vascular clogging risks. We track them jointly.', 'biotech', 2);
INSERT INTO public.packages_listing_guides VALUES (10, 'Pregnancy', 'Iron Stores (Ferritin)', 'Folate and ferritin screening evaluates cellular iron backup levels, detecting hidden fatigue sources early.', 'blood_transfusion', 0);
INSERT INTO public.packages_listing_guides VALUES (11, 'Pregnancy', 'Metabolic Activator', 'TSH and Thyroid hormones screen for hypothyroidism, a major trigger for unexplained weight gain.', 'speed', 1);
INSERT INTO public.packages_listing_guides VALUES (12, 'Pregnancy', 'Bone Preservation', 'Calcium and Vitamin D profiles track mineral retention, helping prevent progressive bone-density loss.', 'accessibility_new', 2);
INSERT INTO public.packages_listing_guides VALUES (13, 'Senior Citizen', 'Filtration Rate (eGFR)', 'Tracks renal waste clearing speed rather than simple creatinine, providing a highly specific kidney age assessment.', 'filter_alt', 0);
INSERT INTO public.packages_listing_guides VALUES (14, 'Senior Citizen', 'Joint Minerals', 'Uric acid and calcium monitoring evaluates arthritis triggers and skeletal mineral integrity side-by-side.', 'accessibility_new', 1);
INSERT INTO public.packages_listing_guides VALUES (15, 'Senior Citizen', 'Chronic Anemia', 'Assesses red blood cell indices to distinguish between nutritional deficiencies and chronic age-related anemias.', 'bloodtype', 2);
INSERT INTO public.packages_listing_guides VALUES (16, 'Thyroid', 'Pituitary Signal (TSH)', 'TSH is the brains hormone driving your thyroid output. It reacts immediately to minor metabolic drops.', 'notifications', 0);
INSERT INTO public.packages_listing_guides VALUES (17, 'Thyroid', 'Free vs. Total Hormones', 'Free T3 and Free T4 measure unbound active hormones, showing the exact levels available for cellular use.', 'analytics', 1);
INSERT INTO public.packages_listing_guides VALUES (18, 'Thyroid', 'Autoimmune Attack Check', 'Anti-TPO and Anti-TG antibodies screen if your bodys immune system is attacking its own thyroid cells.', 'shield', 2);
INSERT INTO public.packages_listing_guides VALUES (19, 'Full Body Checkup', 'Whole System Audit', 'Analyzes blood counts, blood sugar, lipids, thyroid speed, kidney filtration, and liver enzymes in a single visit.', 'checklist', 0);
INSERT INTO public.packages_listing_guides VALUES (20, 'Full Body Checkup', 'Nutrient Backups', 'Tracks Vitamin D and Vitamin B12 levels, critical for nervous system, bones, and immunity backing.', 'nutrition', 1);
INSERT INTO public.packages_listing_guides VALUES (21, 'Full Body Checkup', 'Toxicity & Clearance', 'Reviews uric acid and urea levels alongside liver waste filtration to track daily detox efficiency.', 'biotech', 2);


--
-- TOC entry 5201 (class 0 OID 76963)
-- Dependencies: 250
-- Data for Name: packages_listing_hero_metadata; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.packages_listing_hero_metadata VALUES (1, 'Cancer', 'Cancer Screening Packages', 'Early detection screening packages designed to identify potential cancer markers and support proactive health monitoring.', '{"Preventive Screening","Family Risk History","Annual Checkup","High Risk Monitoring"}', 'Early detection significantly increases the success rate of cancer treatments. Regular screenings can identify cellular changes before they become symptomatic. Recommended for individuals over 35, those with familial history, or specific environmental risk factors.', 'https://images.unsplash.com/photo-1579684389782-64d84b5e9053?w=600&q=80', '[{"icon": "verified", "text": "NABL Certified Labs"}, {"icon": "shield_with_heart", "text": "Secure Data Privacy"}]');
INSERT INTO public.packages_listing_hero_metadata VALUES (2, 'Heart', 'Heart Health Screening Packages', 'Advanced cardiac profiling designed to detect cholesterol levels, coronary risk factors, and basic cardiovascular vulnerabilities early.', '{"Lipid Panel","Coronary Risk","Artery Health","Blood Pressure"}', 'Cardiovascular diseases are often silent and progressive. Screening packages assess lipids, cardiac markers (like Hs-CRP, ApoA/ApoB), and metabolic markers to predict plaque deposit rates. Highly recommended for people with stressful lifestyles, family history of hypertension, high cholesterol, or sedentary habits.', 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=600&q=80', '[{"icon": "verified", "text": "NABL Certified Labs"}, {"icon": "shield_with_heart", "text": "Secure Data Privacy"}]');
INSERT INTO public.packages_listing_hero_metadata VALUES (3, 'Diabetes', 'Diabetes Care & Monitoring Packages', 'Comprehensive glycemic assessments evaluating HbA1c, fasting glucose, and organ filtration to track and manage blood sugar levels.', '{"HbA1c Average","Glucose Fasting","Renal Protection","Insulin Sensitivity"}', 'Diabetes impacts every major organ system, especially kidneys and nerves. Monitoring panels check glycosylated hemoglobin (HbA1c) alongside microalbumin and creatinine to evaluate early kidney leakage. Essential for diabetics, pre-diabetics, or those with family histories.', 'https://images.unsplash.com/photo-1579684389782-64d84b5e9053?w=600&q=80', '[{"icon": "verified", "text": "NABL Certified Labs"}, {"icon": "shield_with_heart", "text": "Secure Data Privacy"}]');
INSERT INTO public.packages_listing_hero_metadata VALUES (4, 'Pregnancy', 'Women Wellness & Hormonal Packages', 'Specialized screenings designed to evaluate female hormone balances, ovarian health, bone retention, and thyroid efficiency.', '{"Hormonal Harmony","Anemia Screening","Ovarian Markers","Bone Calcium"}', 'Women have distinct physiological timelines. Wellness packages track iron storage (ferritin), thyroid speed (TSH), bone minerals (calcium, Vitamin D), and vital blood counts. Recommended for tracking PCOS, fatigue, menstrual irregularities, or routine age-specific wellness.', 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80', '[{"icon": "verified", "text": "NABL Certified Labs"}, {"icon": "shield_with_heart", "text": "Secure Data Privacy"}]');
INSERT INTO public.packages_listing_hero_metadata VALUES (5, 'Senior Citizen', 'Senior Citizen Health Packages', 'Geriatric-focused diagnostic panels designed to monitor kidney filtration, joint degeneration, anemia, and cardiac strength.', '{"Geriatric Precision","Organ Age","Bone Strength","Chronic Check"}', 'Aging changes how our bodies process drugs and nutrients. These panels assess renal clearance (eGFR), uric acid, calcium, lipid blockages, and blood indices to manage chronic wellness. Optimized for senior adults to maintain active independence.', 'https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=600&q=80', '[{"icon": "verified", "text": "NABL Certified Labs"}, {"icon": "shield_with_heart", "text": "Secure Data Privacy"}]');
INSERT INTO public.packages_listing_hero_metadata VALUES (6, 'Thyroid', 'Thyroid Health & Metabolic Packages', 'Specific hormone panels evaluating T3, T4, and TSH levels to identify underactive or overactive metabolic states.', '{"TSH Control","Active T3","Free Thyroxine","Metabolic Speed"}', 'The thyroid gland controls how every cell uses energy. Tiny imbalances trigger systemic fatigue, mood changes, weight gain, or heart palpitations. Our panels track hormone levels with chemical precision. Highly recommended for chronic fatigue, thinning hair, or weight shifts.', 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=200&q=80', '[{"icon": "verified", "text": "NABL Certified Labs"}, {"icon": "shield_with_heart", "text": "Secure Data Privacy"}]');
INSERT INTO public.packages_listing_hero_metadata VALUES (7, 'Full Body Checkup', 'Comprehensive Full Body Checkup Packages', 'Standardized clinical screenings analyzing vital metabolic biomarkers across blood, heart, liver, kidneys, and thyroid systems.', '{"64+ Vital Markers","Systemic Screen","Organ Health","Baseline Audit"}', 'An annual full body checkup is the cornerstone of preventative longevity. By mapping 64+ key markers, it discovers metabolic shifts, pre-diabetes, fatty liver, and kidney inefficiencies early when they are 100% reversible. Recommended once a year for all adults.', 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=200&q=80', '[{"icon": "verified", "text": "NABL Certified Labs"}, {"icon": "shield_with_heart", "text": "Secure Data Privacy"}]');


--
-- TOC entry 5203 (class 0 OID 76976)
-- Dependencies: 252
-- Data for Name: packages_listing_tiers; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.packages_listing_tiers VALUES (15, 'Pregnancy', 'Comprehensive', 'Full wellness & cancer markers', 'biotech', 2999, 2);
INSERT INTO public.packages_listing_tiers VALUES (16, 'Pregnancy', 'Premium', 'Elite ovarian & metabolic profile', 'health_and_safety', 4999, 3);
INSERT INTO public.packages_listing_tiers VALUES (17, 'Senior Citizen', 'Essential', 'Basic metabolic baseline', 'elderly', 1299, 0);
INSERT INTO public.packages_listing_tiers VALUES (18, 'Senior Citizen', 'Advanced', 'Kidney, bone & heart panel', 'monitoring', 2199, 1);
INSERT INTO public.packages_listing_tiers VALUES (19, 'Senior Citizen', 'Comprehensive', 'Full system geriatric check', 'biotech', 3499, 2);
INSERT INTO public.packages_listing_tiers VALUES (20, 'Senior Citizen', 'Premium', 'Elite longevity profile', 'health_and_safety', 5499, 3);
INSERT INTO public.packages_listing_tiers VALUES (21, 'Thyroid', 'Essential', 'Basic T3, T4, TSH panel', 'biotech', 299, 0);
INSERT INTO public.packages_listing_tiers VALUES (22, 'Thyroid', 'Advanced', 'Free T3/T4 & TSH screening', 'monitoring', 699, 1);
INSERT INTO public.packages_listing_tiers VALUES (23, 'Thyroid', 'Comprehensive', 'Thyroid & metabolic screen', 'biotech', 1299, 2);
INSERT INTO public.packages_listing_tiers VALUES (24, 'Thyroid', 'Premium', 'Thyroid antibody autoimmune check', 'health_and_safety', 2499, 3);
INSERT INTO public.packages_listing_tiers VALUES (25, 'Full Body Checkup', 'Essential', 'Core metabolic baseline', 'health_and_safety', 999, 0);
INSERT INTO public.packages_listing_tiers VALUES (26, 'Full Body Checkup', 'Advanced', 'Comprehensive organ & bone screen', 'monitoring', 1899, 1);
INSERT INTO public.packages_listing_tiers VALUES (27, 'Full Body Checkup', 'Comprehensive', 'Full system oncology & mineral check', 'biotech', 3499, 2);
INSERT INTO public.packages_listing_tiers VALUES (1, 'Cancer', 'Essential', 'Basic screening markers', 'clinical_notes', 1499, 0);
INSERT INTO public.packages_listing_tiers VALUES (2, 'Cancer', 'Advanced', 'Enhanced marker profile', 'science', 3999, 1);
INSERT INTO public.packages_listing_tiers VALUES (3, 'Cancer', 'Comprehensive', 'Full oncology screening', 'biotech', 7499, 2);
INSERT INTO public.packages_listing_tiers VALUES (4, 'Cancer', 'Premium', 'Elite predictive profile', 'health_and_safety', 12999, 3);
INSERT INTO public.packages_listing_tiers VALUES (5, 'Heart', 'Essential', 'Basic lipid and BP screening', 'favorite', 999, 0);
INSERT INTO public.packages_listing_tiers VALUES (6, 'Heart', 'Advanced', 'Enhanced cholesterol & risk panel', 'monitoring', 1999, 1);
INSERT INTO public.packages_listing_tiers VALUES (7, 'Heart', 'Comprehensive', 'Full cardiac biomarker check', 'biotech', 3499, 2);
INSERT INTO public.packages_listing_tiers VALUES (8, 'Heart', 'Premium', 'Elite cardio-vascular tracking', 'health_and_safety', 5999, 3);
INSERT INTO public.packages_listing_tiers VALUES (9, 'Diabetes', 'Essential', 'Basic sugar monitoring', 'bloodtype', 349, 0);
INSERT INTO public.packages_listing_tiers VALUES (10, 'Diabetes', 'Advanced', 'HbA1c & lipid profiles', 'monitoring', 999, 1);
INSERT INTO public.packages_listing_tiers VALUES (11, 'Diabetes', 'Comprehensive', 'Organ impact screening', 'biotech', 1899, 2);
INSERT INTO public.packages_listing_tiers VALUES (12, 'Diabetes', 'Premium', 'Full diabetic systemic checkup', 'health_and_safety', 2999, 3);
INSERT INTO public.packages_listing_tiers VALUES (13, 'Pregnancy', 'Essential', 'Basic health & blood counts', 'woman', 899, 0);
INSERT INTO public.packages_listing_tiers VALUES (14, 'Pregnancy', 'Advanced', 'Hormone & thyroid panel', 'monitoring', 1799, 1);
INSERT INTO public.packages_listing_tiers VALUES (28, 'Full Body Checkup', 'Premium', 'Elite whole-body predictive profile', 'health_and_safety', 6999, 3);


--
-- TOC entry 5181 (class 0 OID 60571)
-- Dependencies: 230
-- Data for Name: reports; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 5171 (class 0 OID 60471)
-- Dependencies: 220
-- Data for Name: tests; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.tests VALUES (90, 'Lipid Profile', 'Redcliffe Labs', 'Laxmi Nagar, Delhi', 28.6304000, 77.2774000, 'Measures cholesterol and triglyceride levels to assess heart health.', '12 HR', 510, 'blood', true, 'Blood Specimen', 'Requires 10-12 hours of overnight fasting. Only plain water is permitted. Avoid alcohol and fatty food for 24 hours prior.', '[{"body": "Checks total cholesterol, HDL, LDL, and triglycerides to predict plaque buildup and heart disease risk.", "title": "Cardiovascular Risk Audit"}, {"body": "Essential for monitoring metabolic response to diet, exercise, and lipid-lowering therapies.", "title": "Active Health Tracking"}]', '[{"desc": "The overall amount of cholesterol in your blood.", "name": "Total Cholesterol", "strength": "100%"}, {"desc": "Helps remove extra cholesterol from your bloodstream.", "name": "HDL (Good Cholesterol)", "strength": "100%"}, {"desc": "Main contributor to plaque buildup and artery clogging.", "name": "LDL (Bad Cholesterol)", "strength": "100%"}, {"desc": "Type of fat stored in cells, associated with metabolic syndrome.", "name": "Triglycerides", "strength": "100%"}, {"desc": "Carries triglycerides through your blood, highly atherogenic.", "name": "VLDL Cholesterol", "strength": "100%"}]', NULL, 'Key lipid panel measuring HDL, LDL, and triglycerides to evaluate cardiovascular risk.', '[{"a": "Most labs provide digital reports within 8-12 hours of sample collection.", "q": "How long does it take to get Lipid Profile results?"}, {"a": "Yes, a strict 10-12 hour overnight fast is mandatory for accurate LDL and Triglycerides readings. Only plain water is allowed.", "q": "Is fasting mandatory for Lipid Profile?"}, {"a": "No, tea, coffee, milk, or any beverages must be avoided as they can interfere with metabolic markers. Only plain water is allowed.", "q": "Can I drink tea or coffee before the test?"}]');
INSERT INTO public.tests VALUES (150, 'Cardiac Risk Panel', NULL, NULL, NULL, NULL, 'Evaluates biochemical markers and inflammatory risk levels for early warning signs of coronary disease.', '24 Hours', 1299, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (16, 'Thyroid Profile (T3, T4, TSH)', 'Dr. Lal PathLabs', 'Rohini, Delhi', 28.7041000, 77.1025000, 'Measurement of T3, T4, and TSH levels to evaluate thyroid health.', '12 HR', 550, 'blood', true, 'Blood Specimen', 'No fasting required. Best collected in the morning before taking thyroid medication.', '[{"body": "Screens for overactive (hyperthyroidism) or underactive (hypothyroidism) thyroid gland function.", "title": "Metabolism Clearance Audit"}, {"body": "Tracks T3, T4, and TSH levels to identify systemic sluggishness, fatigue, or unexplained weight shifts.", "title": "Hormonal Balance Check"}]', '[{"desc": "Active thyroid hormone regulating body temperature and metabolic rate.", "name": "T3 (Triiodothyronine)", "strength": "100%"}, {"desc": "Primary thyroid hormone converted by the body into active T3.", "name": "T4 (Thyroxine)", "strength": "100%"}, {"desc": "Pituitary hormone that prompts the thyroid gland to produce T3/T4.", "name": "TSH (Thyroid Stimulating Hormone)", "strength": "100%"}]', NULL, 'Hormone profile assessing T3, T4, and TSH to evaluate thyroid gland activity and metabolic function.', '[{"a": "It is recommended to give your blood sample in the morning before taking your daily thyroid dose, unless advised otherwise by your doctor.", "q": "Should I take my thyroid medicine before the test?"}, {"a": "No, fasting is not mandatory for a basic thyroid profile test. You can eat and drink normally.", "q": "Is fasting required for a Thyroid test?"}]');
INSERT INTO public.tests VALUES (76, 'Dengue NS1 Antigen', 'Pathkind Labs', 'Rohini, Delhi', 28.7041000, 77.1025000, 'Diagnostic laboratory test for medical evaluation.', '12 HR', 792, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (20, 'HbA1c (Glycosylated Hemoglobin)', 'SRL Diagnostics', 'Pitampura, Delhi', 28.6990000, 77.1384000, 'Measures average blood sugar levels over the past 2-3 months.', '6 HR', 450, 'blood', true, 'Blood Specimen', 'No fasting required. Can be done at any time of the day.', '[{"body": "Provides a reliable average of blood sugar levels over the past 90 days, unaffected by recent meals.", "title": "3-Month Glycemic Tracking"}, {"body": "The gold standard for diagnosing pre-diabetes and monitoring diabetic therapy efficacy.", "title": "Diabetes Diagnosis & Control"}]', '[{"desc": "Percentage of hemoglobin bound to glucose, reflecting long-term sugar stores.", "name": "Glycated Hemoglobin (HbA1c)", "strength": "100%"}, {"desc": "Calculated average blood sugar in mg/dL corresponding to the HbA1c percentage.", "name": "Estimated Average Glucose (eAG)", "strength": "100%"}]', NULL, 'Glycosylated hemoglobin test measuring average blood glucose levels over the past 3 months.', '[{"a": "No, fasting is not required for HbA1c. You can have this test at any time, regardless of when you last ate.", "q": "Do I need to fast for an HbA1c test?"}, {"a": "Regular glucose tests show real-time sugar at that exact second. HbA1c shows a 3-month average, which is much more stable and accurate for diagnostic trends.", "q": "How is HbA1c different from regular blood sugar tests?"}]');
INSERT INTO public.tests VALUES (162, 'High Sensitivity CRP (hs-CRP)', NULL, NULL, NULL, NULL, 'Highly sensitive C-reactive protein screen assessing baseline arterial inflammation parameters.', '8 Hours', 550, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (60, 'Lipid Profile', 'Dr. Lal PathLabs', 'Rohini, Delhi', 28.7041000, 77.1025000, 'Measures cholesterol and triglyceride levels to assess heart health.', '12 HR', 200, 'blood', true, 'Blood Specimen', 'Requires 10-12 hours of overnight fasting. Only plain water is permitted. Avoid alcohol and fatty food for 24 hours prior.', '[{"body": "Checks total cholesterol, HDL, LDL, and triglycerides to predict plaque buildup and heart disease risk.", "title": "Cardiovascular Risk Audit"}, {"body": "Essential for monitoring metabolic response to diet, exercise, and lipid-lowering therapies.", "title": "Active Health Tracking"}]', '[{"desc": "The overall amount of cholesterol in your blood.", "name": "Total Cholesterol", "strength": "100%"}, {"desc": "Helps remove extra cholesterol from your bloodstream.", "name": "HDL (Good Cholesterol)", "strength": "100%"}, {"desc": "Main contributor to plaque buildup and artery clogging.", "name": "LDL (Bad Cholesterol)", "strength": "100%"}, {"desc": "Type of fat stored in cells, associated with metabolic syndrome.", "name": "Triglycerides", "strength": "100%"}, {"desc": "Carries triglycerides through your blood, highly atherogenic.", "name": "VLDL Cholesterol", "strength": "100%"}]', NULL, 'Key lipid panel measuring HDL, LDL, and triglycerides to evaluate cardiovascular risk.', '[{"a": "Most labs provide digital reports within 8-12 hours of sample collection.", "q": "How long does it take to get Lipid Profile results?"}, {"a": "Yes, a strict 10-12 hour overnight fast is mandatory for accurate LDL and Triglycerides readings. Only plain water is allowed.", "q": "Is fasting mandatory for Lipid Profile?"}, {"a": "No, tea, coffee, milk, or any beverages must be avoided as they can interfere with metabolic markers. Only plain water is allowed.", "q": "Can I drink tea or coffee before the test?"}]');
INSERT INTO public.tests VALUES (18, 'Thyroid Profile (T3, T4, TSH)', 'Healthians', 'Vasant Kunj, Delhi', 28.5200000, 77.1587000, 'Measurement of T3, T4, and TSH levels to evaluate thyroid health.', '6 HR', 350, 'blood', true, 'Blood Specimen', 'No fasting required. Best collected in the morning before taking thyroid medication.', '[{"body": "Screens for overactive (hyperthyroidism) or underactive (hypothyroidism) thyroid gland function.", "title": "Metabolism Clearance Audit"}, {"body": "Tracks T3, T4, and TSH levels to identify systemic sluggishness, fatigue, or unexplained weight shifts.", "title": "Hormonal Balance Check"}]', '[{"desc": "Active thyroid hormone regulating body temperature and metabolic rate.", "name": "T3 (Triiodothyronine)", "strength": "100%"}, {"desc": "Primary thyroid hormone converted by the body into active T3.", "name": "T4 (Thyroxine)", "strength": "100%"}, {"desc": "Pituitary hormone that prompts the thyroid gland to produce T3/T4.", "name": "TSH (Thyroid Stimulating Hormone)", "strength": "100%"}]', NULL, 'Hormone profile assessing T3, T4, and TSH to evaluate thyroid gland activity and metabolic function.', '[{"a": "It is recommended to give your blood sample in the morning before taking your daily thyroid dose, unless advised otherwise by your doctor.", "q": "Should I take my thyroid medicine before the test?"}, {"a": "No, fasting is not mandatory for a basic thyroid profile test. You can eat and drink normally.", "q": "Is fasting required for a Thyroid test?"}]');
INSERT INTO public.tests VALUES (163, 'Lipoprotein (a) [Lp(a)]', NULL, NULL, NULL, NULL, 'Measures Lipoprotein (a) levels to evaluate genetically determined coronary risk variables.', '16 Hours', 900, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (24, 'Vitamin D (25-OH)', 'Apollo Diagnostics', 'Sarita Vihar, Delhi', 28.5286000, 77.2883000, 'Checks for deficiency of Vitamin D to ensure bone health.', '8 HR', 900, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Vital screening measuring vitamin D levels for bone health, immune support, and calcium absorption.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (164, 'Homocysteine Cardio', NULL, NULL, NULL, NULL, 'Assesses blood Homocysteine to screen for early arterial tissue damage and stroke markers.', '12 Hours', 1100, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (99, 'Vitamin B12', 'Metro Diagnostics', 'Connaught Place, Delhi', 28.6315000, 77.2167000, 'Diagnostic laboratory test for medical evaluation.', '12 HR', 843, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (107, 'Malaria Parasite', 'SRL Diagnostics', 'Connaught Place, Delhi', 28.6315000, 77.2167000, 'Diagnostic laboratory test for medical evaluation.', '12 HR', 339, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (115, 'PSA (Prostate Specific Antigen)', 'City X-Ray & Scan', 'Connaught Place, Delhi', 28.6315000, 77.2167000, 'Diagnostic laboratory test for medical evaluation.', '12 HR', 635, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (68, 'Vitamin D', 'Apollo Diagnostics', 'Rohini, Delhi', 28.7041000, 77.1025000, 'Checks for deficiency of Vitamin D to ensure bone health.', '12 HR', 496, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Vital screening measuring vitamin D levels for bone health, immune support, and calcium absorption.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (22, 'HbA1c (Glycosylated Hemoglobin)', 'Dr. Dang Lab', 'SDA, Delhi', 28.5478000, 77.2001000, 'Measures average blood sugar levels over the past 2-3 months.', '6 HR', 600, 'blood', true, 'Blood Specimen', 'No fasting required. Can be done at any time of the day.', '[{"body": "Provides a reliable average of blood sugar levels over the past 90 days, unaffected by recent meals.", "title": "3-Month Glycemic Tracking"}, {"body": "The gold standard for diagnosing pre-diabetes and monitoring diabetic therapy efficacy.", "title": "Diabetes Diagnosis & Control"}]', '[{"desc": "Percentage of hemoglobin bound to glucose, reflecting long-term sugar stores.", "name": "Glycated Hemoglobin (HbA1c)", "strength": "100%"}, {"desc": "Calculated average blood sugar in mg/dL corresponding to the HbA1c percentage.", "name": "Estimated Average Glucose (eAG)", "strength": "100%"}]', NULL, 'Glycosylated hemoglobin test measuring average blood glucose levels over the past 3 months.', '[{"a": "No, fasting is not required for HbA1c. You can have this test at any time, regardless of when you last ate.", "q": "Do I need to fast for an HbA1c test?"}, {"a": "Regular glucose tests show real-time sugar at that exact second. HbA1c shows a 3-month average, which is much more stable and accurate for diagnostic trends.", "q": "How is HbA1c different from regular blood sugar tests?"}]');
INSERT INTO public.tests VALUES (125, 'HbA1c (Glycosylated Hemoglobin)', 'City X-Ray & Scan', 'Janakpuri, Delhi', 28.6219000, 77.0878000, 'Measures average blood sugar levels over the past 2-3 months.', '8 HR', 375, 'blood', true, 'Blood Specimen', 'No fasting required. Can be done at any time of the day.', '[{"body": "Provides a reliable average of blood sugar levels over the past 90 days, unaffected by recent meals.", "title": "3-Month Glycemic Tracking"}, {"body": "The gold standard for diagnosing pre-diabetes and monitoring diabetic therapy efficacy.", "title": "Diabetes Diagnosis & Control"}]', '[{"desc": "Percentage of hemoglobin bound to glucose, reflecting long-term sugar stores.", "name": "Glycated Hemoglobin (HbA1c)", "strength": "100%"}, {"desc": "Calculated average blood sugar in mg/dL corresponding to the HbA1c percentage.", "name": "Estimated Average Glucose (eAG)", "strength": "100%"}]', NULL, 'Glycosylated hemoglobin test measuring average blood glucose levels over the past 3 months.', '[{"a": "No, fasting is not required for HbA1c. You can have this test at any time, regardless of when you last ate.", "q": "Do I need to fast for an HbA1c test?"}, {"a": "Regular glucose tests show real-time sugar at that exact second. HbA1c shows a 3-month average, which is much more stable and accurate for diagnostic trends.", "q": "How is HbA1c different from regular blood sugar tests?"}]');
INSERT INTO public.tests VALUES (133, 'HbA1c (Glycosylated Hemoglobin)', 'Bhasin Medicare', 'Janakpuri, Delhi', 28.6219000, 77.0878000, 'Measures average blood sugar levels over the past 2-3 months.', '8 HR', 495, 'blood', true, 'Blood Specimen', 'No fasting required. Can be done at any time of the day.', '[{"body": "Provides a reliable average of blood sugar levels over the past 90 days, unaffected by recent meals.", "title": "3-Month Glycemic Tracking"}, {"body": "The gold standard for diagnosing pre-diabetes and monitoring diabetic therapy efficacy.", "title": "Diabetes Diagnosis & Control"}]', '[{"desc": "Percentage of hemoglobin bound to glucose, reflecting long-term sugar stores.", "name": "Glycated Hemoglobin (HbA1c)", "strength": "100%"}, {"desc": "Calculated average blood sugar in mg/dL corresponding to the HbA1c percentage.", "name": "Estimated Average Glucose (eAG)", "strength": "100%"}]', NULL, 'Glycosylated hemoglobin test measuring average blood glucose levels over the past 3 months.', '[{"a": "No, fasting is not required for HbA1c. You can have this test at any time, regardless of when you last ate.", "q": "Do I need to fast for an HbA1c test?"}, {"a": "Regular glucose tests show real-time sugar at that exact second. HbA1c shows a 3-month average, which is much more stable and accurate for diagnostic trends.", "q": "How is HbA1c different from regular blood sugar tests?"}]');
INSERT INTO public.tests VALUES (96, 'Fasting Blood Sugar', 'Pathkind Labs', 'Vasant Kunj, Delhi', 28.5200000, 77.1587000, 'Diagnostic laboratory test for medical evaluation.', '12 HR', 732, 'blood', true, 'Blood Specimen', 'Requires strict 8-10 hours overnight fasting. No food or drinks except plain water.', '[{"body": "Measures basic circulating glucose levels after fasting to check insulin release efficiency.", "title": "Real-time Insulin Check"}, {"body": "Identifies early-stage insulin resistance or elevated glucose before clinical symptoms develop.", "title": "Pre-Diabetes Screening"}]', '[{"desc": "Circulating sugar level in your bloodstream after fasting.", "name": "Fasting Blood Glucose", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "You must fast for at least 8 to 10 hours overnight. Do not fast for more than 12 hours as it can artificially skew results.", "q": "How long should I fast before the fasting sugar test?"}, {"a": "No. Only plain water is permitted during the fasting hours.", "q": "Can I drink tea or coffee during the fast?"}]');
INSERT INTO public.tests VALUES (65, 'HbA1c', 'Star Imaging', 'Janakpuri, Delhi', 28.6219000, 77.0878000, 'Measures average blood sugar levels over the past 2-3 months.', '12 HR', 385, 'blood', true, 'Blood Specimen', 'No fasting required. Can be done at any time of the day.', '[{"body": "Provides a reliable average of blood sugar levels over the past 90 days, unaffected by recent meals.", "title": "3-Month Glycemic Tracking"}, {"body": "The gold standard for diagnosing pre-diabetes and monitoring diabetic therapy efficacy.", "title": "Diabetes Diagnosis & Control"}]', '[{"desc": "Percentage of hemoglobin bound to glucose, reflecting long-term sugar stores.", "name": "Glycated Hemoglobin (HbA1c)", "strength": "100%"}, {"desc": "Calculated average blood sugar in mg/dL corresponding to the HbA1c percentage.", "name": "Estimated Average Glucose (eAG)", "strength": "100%"}]', NULL, 'Glycosylated hemoglobin test measuring average blood glucose levels over the past 3 months.', '[{"a": "No, fasting is not required for HbA1c. You can have this test at any time, regardless of when you last ate.", "q": "Do I need to fast for an HbA1c test?"}, {"a": "Regular glucose tests show real-time sugar at that exact second. HbA1c shows a 3-month average, which is much more stable and accurate for diagnostic trends.", "q": "How is HbA1c different from regular blood sugar tests?"}]');
INSERT INTO public.tests VALUES (95, 'HbA1c', 'City X-Ray & Scan', 'Saket, Delhi', 28.5245000, 77.2066000, 'Measures average blood sugar levels over the past 2-3 months.', '12 HR', 695, 'blood', true, 'Blood Specimen', 'No fasting required. Can be done at any time of the day.', '[{"body": "Provides a reliable average of blood sugar levels over the past 90 days, unaffected by recent meals.", "title": "3-Month Glycemic Tracking"}, {"body": "The gold standard for diagnosing pre-diabetes and monitoring diabetic therapy efficacy.", "title": "Diabetes Diagnosis & Control"}]', '[{"desc": "Percentage of hemoglobin bound to glucose, reflecting long-term sugar stores.", "name": "Glycated Hemoglobin (HbA1c)", "strength": "100%"}, {"desc": "Calculated average blood sugar in mg/dL corresponding to the HbA1c percentage.", "name": "Estimated Average Glucose (eAG)", "strength": "100%"}]', NULL, 'Glycosylated hemoglobin test measuring average blood glucose levels over the past 3 months.', '[{"a": "No, fasting is not required for HbA1c. You can have this test at any time, regardless of when you last ate.", "q": "Do I need to fast for an HbA1c test?"}, {"a": "Regular glucose tests show real-time sugar at that exact second. HbA1c shows a 3-month average, which is much more stable and accurate for diagnostic trends.", "q": "How is HbA1c different from regular blood sugar tests?"}]');
INSERT INTO public.tests VALUES (151, 'ECG (Heart Rhythm)', NULL, NULL, NULL, NULL, 'Records electrical heart signals to detect irregularities, rhythm disorders, or past cardiac muscle stress.', '6 Hours', 390, 'scanning', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (152, 'Pap Smear (Cervical Health)', NULL, NULL, NULL, NULL, 'Analyzes cervical cells to check for abnormalities, chronic infections, or cellular adjustments.', '48 Hours', 950, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (153, 'Tumor Marker - CA 125 (Ovarian Marker)', NULL, NULL, NULL, NULL, 'Tracks protein levels commonly associated with maternal cellular wellness and reproductive system tracking.', '24 Hours', 1499, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (154, 'Post-Prandial Blood Sugar', NULL, NULL, NULL, NULL, 'Measures glucose levels exactly 2 hours after a meal to track active body sugar clearances.', '6 Hours', 149, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (155, 'Beta HCG (Quantitative)', NULL, NULL, NULL, NULL, 'Measures exact hormone levels to confirm early pregnancy and track gestational timelines.', '12 Hours', 549, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (156, 'Dual Marker Screening', NULL, NULL, NULL, NULL, 'Comprehensive biochemical maternal screen assessing fetal genetic timelines during the first trimester.', '36 Hours', 2499, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (157, 'Food Intolerance Panel (Primary)', NULL, NULL, NULL, NULL, 'Comprehensive mapping of bodily responses to various primary dietary antigens and food profiles.', '48 Hours', 3490, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (158, 'Genetic Wellness Mapping', NULL, NULL, NULL, NULL, 'Unlocks personalized insights on diet, fitness, and inherent physiological predispositions via DNA.', '7 Days', 6999, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (159, 'Carrier Screening (Basic)', NULL, NULL, NULL, NULL, 'Advanced molecular sequencing to evaluate hereditary genes for clinical planning.', '10 Days', 12499, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (2, 'LFT (Liver Function Test)', 'SRL Diagnostics', 'Pitampura, Delhi', 28.6990000, 77.1384000, 'Comprehensive evaluation of liver enzymes, proteins, and bilirubin levels.', '4 HR', 299, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Screening panel checking liver enzymes, bilirubin, and proteins to detect hepatic dysfunction.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (57, 'Colonoscopy', 'Ganesh Diagnostic', 'Laxmi Nagar, Delhi', 28.6304000, 77.2774000, 'Diagnostic laboratory test for medical evaluation.', '3 HR', 4500, 'gastro', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (4, 'LFT (Liver Function Test)', 'Healthians', 'Saket, Delhi', 28.5245000, 77.2066000, 'Comprehensive evaluation of liver enzymes, proteins, and bilirubin levels.', '6 HR', 250, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Screening panel checking liver enzymes, bilirubin, and proteins to detect hepatic dysfunction.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (7, 'KFT (Kidney Function Test)', 'Max Lab', 'Saket, Delhi', 28.5245000, 77.2066000, 'Assessment of kidney function through creatinine, urea, and electrolyte levels.', '6 HR', 500, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Kidney function panel assessing creatinine, BUN, and electrolytes to evaluate renal health.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (48, 'Senior Citizen Package', 'Max Lab', 'Saket, Delhi', 28.5245000, 77.2066000, 'Diagnostic laboratory test for medical evaluation.', '18 HR', 2200, 'package', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (54, 'Endoscopy', 'Max Lab', 'Saket, Delhi', 28.5245000, 77.2066000, 'Diagnostic laboratory test for medical evaluation.', '2 HR', 3500, 'gastro', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (63, 'Complete Blood Count', 'Healthians', 'Saket, Delhi', 28.5245000, 77.2066000, 'Diagnostic laboratory test for medical evaluation.', '12 HR', 311, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Comprehensive blood test evaluating red/white cells, hemoglobin, and platelets to screen for anemia and infection.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (5, 'LFT (Liver Function Test)', 'Redcliffe Labs', 'Dwarka, Delhi', 28.5921000, 77.0460000, 'Comprehensive evaluation of liver enzymes, proteins, and bilirubin levels.', '8 HR', 200, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Screening panel checking liver enzymes, bilirubin, and proteins to detect hepatic dysfunction.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (6, 'KFT (Kidney Function Test)', 'Apollo Diagnostics', 'Dwarka, Delhi', 28.5921000, 77.0460000, 'Assessment of kidney function through creatinine, urea, and electrolyte levels.', '8 HR', 450, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Kidney function panel assessing creatinine, BUN, and electrolytes to evaluate renal health.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (46, 'Full Body Health Checkup (64 Tests)', 'Redcliffe Labs', 'Okhla, Delhi', 28.5355000, 77.2868000, 'Comprehensive screening for various vital health parameters.', '24 HR', 999, 'package', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (77, 'Malaria Parasite', 'House of Diagnostics (HOD)', 'Pitampura, Delhi', 28.6990000, 77.1384000, 'Diagnostic laboratory test for medical evaluation.', '12 HR', 829, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (85, 'PSA (Prostate Specific Antigen)', 'Star Imaging', 'Pitampura, Delhi', 28.6990000, 77.1384000, 'Diagnostic laboratory test for medical evaluation.', '12 HR', 325, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (93, 'Complete Blood Count', 'Mahajan Imaging', 'Pitampura, Delhi', 28.6990000, 77.1384000, 'Diagnostic laboratory test for medical evaluation.', '12 HR', 621, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Comprehensive blood test evaluating red/white cells, hemoglobin, and platelets to screen for anemia and infection.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (101, 'Iron Profile', 'Max Lab', 'Pitampura, Delhi', 28.6990000, 77.1384000, 'Diagnostic laboratory test for medical evaluation.', '12 HR', 917, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (15, 'CBC (Complete Blood Count)', 'Prognosis Laboratories', 'Dwarka, Delhi', 28.5921000, 77.0460000, 'Detailed count of red blood cells, white blood cells, and platelets.', '8 HR', 280, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Comprehensive blood test evaluating red/white cells, hemoglobin, and platelets to screen for anemia and infection.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (25, 'Vitamin D (25-OH)', 'Redcliffe Labs', 'Dwarka, Delhi', 28.5921000, 77.0460000, 'Checks for deficiency of Vitamin D to ensure bone health.', '24 HR', 699, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Vital screening measuring vitamin D levels for bone health, immune support, and calcium absorption.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (8, 'KFT (Kidney Function Test)', 'City X-Ray & Scan', 'Tilak Nagar, Delhi', 28.6365000, 77.0967000, 'Assessment of kidney function through creatinine, urea, and electrolyte levels.', '3 HR', 250, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Kidney function panel assessing creatinine, BUN, and electrolytes to evaluate renal health.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (29, 'Ultrasound Abdomen', 'Star Imaging', 'Tilak Nagar, Delhi', 28.6365000, 77.0967000, 'Diagnostic imaging using high-frequency sound waves.', '2 HR', 800, 'scanning', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'High-resolution imaging diagnostic to examine internal organs, tissues, and blood vessels.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (31, 'X-Ray Chest PA View', 'City X-Ray & Scan', 'Tilak Nagar, Delhi', 28.6365000, 77.0967000, 'Diagnostic laboratory test for medical evaluation.', '1 HR', 350, 'scanning', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (41, 'CT Scan Chest', 'Star Imaging', 'Tilak Nagar, Delhi', 28.6365000, 77.0967000, 'Diagnostic laboratory test for medical evaluation.', '4 HR', 3400, 'scanning', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'High-resolution imaging diagnostic to examine internal organs, tissues, and blood vessels.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (9, 'KFT (Kidney Function Test)', 'Thyrocare', 'Janakpuri, Delhi', 28.6219000, 77.0878000, 'Assessment of kidney function through creatinine, urea, and electrolyte levels.', '12 HR', 220, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Kidney function panel assessing creatinine, BUN, and electrolytes to evaluate renal health.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (53, 'Women''s Wellness Package', 'Pathkind Labs', 'Janakpuri, Delhi', 28.6219000, 77.0878000, 'Diagnostic laboratory test for medical evaluation.', '24 HR', 2500, 'package', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (10, 'KFT (Kidney Function Test)', 'Dr. Dang Lab', 'SDA, Delhi', 28.5478000, 77.2001000, 'Assessment of kidney function through creatinine, urea, and electrolyte levels.', '6 HR', 550, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Kidney function panel assessing creatinine, BUN, and electrolytes to evaluate renal health.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (13, 'CBC (Complete Blood Count)', 'Dr. Dang Lab', 'SDA, Delhi', 28.5478000, 77.2001000, 'Detailed count of red blood cells, white blood cells, and platelets.', '6 HR', 450, 'blood', false, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Comprehensive blood test evaluating red/white cells, hemoglobin, and platelets to screen for anemia and infection.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (11, 'CBC (Complete Blood Count)', 'Dr. Lal PathLabs', 'Vasant Kunj, Delhi', 28.5200000, 77.1587000, 'Detailed count of red blood cells, white blood cells, and platelets.', '4 HR', 300, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Comprehensive blood test evaluating red/white cells, hemoglobin, and platelets to screen for anemia and infection.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (45, 'Full Body Health Checkup (64 Tests)', 'Healthians', 'Vasant Kunj, Delhi', 28.5200000, 77.1587000, 'Comprehensive screening for various vital health parameters.', '12 HR', 1099, 'package', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (14, 'CBC (Complete Blood Count)', 'House of Diagnostics (HOD)', 'Karkardooma, Delhi', 28.6487000, 77.3057000, 'Detailed count of red blood cells, white blood cells, and platelets.', '4 HR', 250, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Comprehensive blood test evaluating red/white cells, hemoglobin, and platelets to screen for anemia and infection.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (33, 'X-Ray Chest PA View', 'House of Diagnostics (HOD)', 'Karkardooma, Delhi', 28.6487000, 77.3057000, 'Diagnostic laboratory test for medical evaluation.', '1 HR', 300, 'scanning', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (12, 'CBC (Complete Blood Count)', 'Saral Advanced', 'Pitampura, Delhi', 28.6990000, 77.1384000, 'Detailed count of red blood cells, white blood cells, and platelets.', '2 HR', 200, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Comprehensive blood test evaluating red/white cells, hemoglobin, and platelets to screen for anemia and infection.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (32, 'X-Ray Chest PA View', 'Saral Advanced', 'Pitampura, Delhi', 28.6990000, 77.1384000, 'Diagnostic laboratory test for medical evaluation.', '2 HR', 400, 'scanning', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (51, 'Women''s Wellness Package', 'SRL Diagnostics', 'Pitampura, Delhi', 28.6990000, 77.1384000, 'Diagnostic laboratory test for medical evaluation.', '24 HR', 3000, 'package', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (61, 'Liver Function Test', 'Max Lab', 'Pitampura, Delhi', 28.6990000, 77.1384000, 'Diagnostic laboratory test for medical evaluation.', '12 HR', 237, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Screening panel checking liver enzymes, bilirubin, and proteins to detect hepatic dysfunction.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (69, 'Vitamin B12', 'Dr. Dang Lab', 'Pitampura, Delhi', 28.6990000, 77.1384000, 'Diagnostic laboratory test for medical evaluation.', '12 HR', 533, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (3, 'LFT (Liver Function Test)', 'Ganesh Diagnostic', 'Laxmi Nagar, Delhi', 28.6304000, 77.2774000, 'Comprehensive evaluation of liver enzymes, proteins, and bilirubin levels.', '2 HR', 199, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Screening panel checking liver enzymes, bilirubin, and proteins to detect hepatic dysfunction.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (34, 'X-Ray Chest PA View', 'Modern Diagnostic', 'Laxmi Nagar, Delhi', 28.6304000, 77.2774000, 'Diagnostic laboratory test for medical evaluation.', '2 HR', 350, 'scanning', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (44, 'Full Body Health Checkup (64 Tests)', 'Ganesh Diagnostic', 'Laxmi Nagar, Delhi', 28.6304000, 77.2774000, 'Comprehensive screening for various vital health parameters.', '12 HR', 899, 'package', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (1, 'LFT (Liver Function Test)', 'Dr. Lal PathLabs', 'Rohini, Delhi', 28.7041000, 77.1025000, 'Comprehensive evaluation of liver enzymes, proteins, and bilirubin levels.', '6 HR', 350, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Screening panel checking liver enzymes, bilirubin, and proteins to detect hepatic dysfunction.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (23, 'Vitamin D (25-OH)', 'Dr. Lal PathLabs', 'Rohini, Delhi', 28.7041000, 77.1025000, 'Checks for deficiency of Vitamin D to ensure bone health.', '12 HR', 1200, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Vital screening measuring vitamin D levels for bone health, immune support, and calcium absorption.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (28, 'Ultrasound Abdomen', 'Ganesh Diagnostic', 'Rohini, Delhi', 28.7041000, 77.1025000, 'Diagnostic imaging using high-frequency sound waves.', '1 HR', 750, 'scanning', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'High-resolution imaging diagnostic to examine internal organs, tissues, and blood vessels.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (40, 'CT Scan Chest', 'Ganesh Diagnostic', 'Rohini, Delhi', 28.7041000, 77.1025000, 'Diagnostic laboratory test for medical evaluation.', '2 HR', 3200, 'scanning', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'High-resolution imaging diagnostic to examine internal organs, tissues, and blood vessels.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (47, 'Senior Citizen Package', 'Dr. Lal PathLabs', 'Rohini, Delhi', 28.7041000, 77.1025000, 'Diagnostic laboratory test for medical evaluation.', '24 HR', 2500, 'package', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (39, 'CT Scan Chest', 'House of Diagnostics (HOD)', 'Karkardooma, Delhi', 28.6487000, 77.3057000, 'Diagnostic laboratory test for medical evaluation.', '4 HR', 3500, 'scanning', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'High-resolution imaging diagnostic to examine internal organs, tissues, and blood vessels.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (50, 'Senior Citizen Package', 'House of Diagnostics (HOD)', 'Karkardooma, Delhi', 28.6487000, 77.3057000, 'Diagnostic laboratory test for medical evaluation.', '18 HR', 1999, 'package', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (52, 'Women''s Wellness Package', 'Apollo Diagnostics', 'Sarita Vihar, Delhi', 28.5286000, 77.2883000, 'Diagnostic laboratory test for medical evaluation.', '24 HR', 2800, 'package', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (55, 'Endoscopy', 'Apollo Diagnostics', 'Sarita Vihar, Delhi', 28.5286000, 77.2883000, 'Diagnostic laboratory test for medical evaluation.', '4 HR', 4000, 'gastro', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (26, 'Ultrasound Abdomen', 'Mahajan Imaging', 'South Extension, Delhi', 28.5687000, 77.2209000, 'Diagnostic imaging using high-frequency sound waves.', '2 HR', 1200, 'scanning', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'High-resolution imaging diagnostic to examine internal organs, tissues, and blood vessels.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (27, 'Ultrasound Abdomen', 'City X-Ray & Scan', 'Vikas Puri, Delhi', 28.6388000, 77.0704000, 'Diagnostic imaging using high-frequency sound waves.', '1 HR', 900, 'scanning', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'High-resolution imaging diagnostic to examine internal organs, tissues, and blood vessels.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (30, 'Ultrasound Abdomen', 'Focus Imaging', 'Green Park, Delhi', 28.5582000, 77.2028000, 'Diagnostic imaging using high-frequency sound waves.', '1 HR', 1100, 'scanning', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'High-resolution imaging diagnostic to examine internal organs, tissues, and blood vessels.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (38, 'MRI Brain', 'Focus Imaging', 'Green Park, Delhi', 28.5582000, 77.2028000, 'High-resolution diagnostic imaging using magnetic resonance.', '6 HR', 6000, 'scanning', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (35, 'MRI Brain', 'Mahajan Imaging', 'Defence Colony, Delhi', 28.5718000, 77.2320000, 'High-resolution diagnostic imaging using magnetic resonance.', '4 HR', 6500, 'scanning', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (36, 'MRI Brain', 'Dr. Lal PathLabs', 'Preet Vihar, Delhi', 28.6415000, 77.2951000, 'High-resolution diagnostic imaging using magnetic resonance.', '6 HR', 5500, 'scanning', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (37, 'MRI Brain', 'Metro Diagnostics', 'Punjabi Bagh, Delhi', 28.6689000, 77.1325000, 'High-resolution diagnostic imaging using magnetic resonance.', '4 HR', 5000, 'scanning', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (59, 'Colonoscopy', 'Metro Diagnostics', 'Punjabi Bagh, Delhi', 28.6689000, 77.1325000, 'Diagnostic laboratory test for medical evaluation.', '4 HR', 4800, 'gastro', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (43, 'Full Body Health Checkup (64 Tests)', 'SRL Diagnostics', 'Connaught Place, Delhi', 28.6315000, 77.2167000, 'Comprehensive screening for various vital health parameters.', '24 HR', 1299, 'package', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (67, 'Post Prandial Blood Sugar', 'SRL Diagnostics', 'Connaught Place, Delhi', 28.6315000, 77.2167000, 'Diagnostic laboratory test for medical evaluation.', '12 HR', 459, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (56, 'Endoscopy', 'Fortis Diagnostic', 'Shalimar Bagh, Delhi', 28.7164000, 77.1563000, 'Diagnostic laboratory test for medical evaluation.', '3 HR', 4200, 'gastro', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (58, 'Colonoscopy', 'Max Lab', 'Patparganj, Delhi', 28.6173000, 77.2931000, 'Diagnostic laboratory test for medical evaluation.', '2 HR', 5000, 'gastro', false, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (109, 'CRP (C-Reactive Protein)', 'Dr. Dang Lab', 'Pitampura, Delhi', 28.6990000, 77.1384000, 'Diagnostic laboratory test for medical evaluation.', '12 HR', 413, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (117, 'Prolactin', 'House of Diagnostics (HOD)', 'Pitampura, Delhi', 28.6990000, 77.1384000, 'Diagnostic laboratory test for medical evaluation.', '12 HR', 709, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (74, 'Triglycerides', 'Ganesh Diagnostic', 'Laxmi Nagar, Delhi', 28.6304000, 77.2774000, 'Diagnostic laboratory test for medical evaluation.', '12 HR', 718, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (82, 'Blood Urea Nitrogen', 'Thyrocare', 'Laxmi Nagar, Delhi', 28.6304000, 77.2774000, 'Diagnostic laboratory test for medical evaluation.', '12 HR', 214, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (98, 'Vitamin D', 'Saral Advanced', 'Laxmi Nagar, Delhi', 28.6304000, 77.2774000, 'Checks for deficiency of Vitamin D to ensure bone health.', '12 HR', 806, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Vital screening measuring vitamin D levels for bone health, immune support, and calcium absorption.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (106, 'Dengue NS1 Antigen', 'Modern Diagnostic', 'Laxmi Nagar, Delhi', 28.6304000, 77.2774000, 'Diagnostic laboratory test for medical evaluation.', '12 HR', 302, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (114, 'Hb Electrophoresis', 'Ganesh Diagnostic', 'Laxmi Nagar, Delhi', 28.6304000, 77.2774000, 'Diagnostic laboratory test for medical evaluation.', '12 HR', 598, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (71, 'Iron Profile', 'Bhasin Medicare', 'Saket, Delhi', 28.5245000, 77.2066000, 'Diagnostic laboratory test for medical evaluation.', '12 HR', 607, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (79, 'CRP (C-Reactive Protein)', 'Metro Diagnostics', 'Saket, Delhi', 28.5245000, 77.2066000, 'Diagnostic laboratory test for medical evaluation.', '12 HR', 903, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (87, 'Prolactin', 'SRL Diagnostics', 'Saket, Delhi', 28.5245000, 77.2066000, 'Diagnostic laboratory test for medical evaluation.', '12 HR', 399, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (103, 'Cholesterol Total', 'Healthians', 'Saket, Delhi', 28.5245000, 77.2066000, 'Diagnostic laboratory test for medical evaluation.', '12 HR', 991, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Key lipid panel measuring HDL, LDL, and triglycerides to evaluate cardiovascular risk.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (111, 'Serum Creatinine', 'Bhasin Medicare', 'Saket, Delhi', 28.5245000, 77.2066000, 'Diagnostic laboratory test for medical evaluation.', '12 HR', 487, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (119, 'LH', 'Metro Diagnostics', 'Saket, Delhi', 28.5245000, 77.2066000, 'Diagnostic laboratory test for medical evaluation.', '12 HR', 783, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (70, 'Calcium', 'Redcliffe Labs', 'Dwarka, Delhi', 28.5921000, 77.0460000, 'Diagnostic laboratory test for medical evaluation.', '12 HR', 570, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (78, 'Typhoid IgG/IgM', 'Saral Advanced', 'Dwarka, Delhi', 28.5921000, 77.0460000, 'Diagnostic laboratory test for medical evaluation.', '12 HR', 866, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (86, 'Testosterone', 'Modern Diagnostic', 'Dwarka, Delhi', 28.5921000, 77.0460000, 'Diagnostic laboratory test for medical evaluation.', '12 HR', 362, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (102, 'Uric Acid', 'Thyrocare', 'Dwarka, Delhi', 28.5921000, 77.0460000, 'Diagnostic laboratory test for medical evaluation.', '12 HR', 954, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (110, 'ESR (Erythrocyte Sedimentation Rate)', 'Redcliffe Labs', 'Dwarka, Delhi', 28.5921000, 77.0460000, 'Diagnostic laboratory test for medical evaluation.', '12 HR', 450, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (118, 'FSH', 'Saral Advanced', 'Dwarka, Delhi', 28.5921000, 77.0460000, 'Diagnostic laboratory test for medical evaluation.', '12 HR', 746, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (73, 'Cholesterol Total', 'Mahajan Imaging', 'Janakpuri, Delhi', 28.6219000, 77.0878000, 'Diagnostic laboratory test for medical evaluation.', '12 HR', 681, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Key lipid panel measuring HDL, LDL, and triglycerides to evaluate cardiovascular risk.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (81, 'Serum Creatinine', 'Max Lab', 'Janakpuri, Delhi', 28.6219000, 77.0878000, 'Diagnostic laboratory test for medical evaluation.', '12 HR', 977, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (89, 'LH', 'Dr. Dang Lab', 'Janakpuri, Delhi', 28.6219000, 77.0878000, 'Diagnostic laboratory test for medical evaluation.', '12 HR', 473, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (97, 'Post Prandial Blood Sugar', 'House of Diagnostics (HOD)', 'Janakpuri, Delhi', 28.6219000, 77.0878000, 'Diagnostic laboratory test for medical evaluation.', '12 HR', 769, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (105, 'Widal Test', 'Star Imaging', 'Janakpuri, Delhi', 28.6219000, 77.0878000, 'Diagnostic laboratory test for medical evaluation.', '12 HR', 265, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (113, 'Serum Electrolytes', 'Mahajan Imaging', 'Janakpuri, Delhi', 28.6219000, 77.0878000, 'Diagnostic laboratory test for medical evaluation.', '12 HR', 561, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (72, 'Uric Acid', 'Focus Imaging', 'Vasant Kunj, Delhi', 28.5200000, 77.1587000, 'Diagnostic laboratory test for medical evaluation.', '12 HR', 644, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (80, 'ESR (Erythrocyte Sedimentation Rate)', 'Dr. Lal PathLabs', 'Vasant Kunj, Delhi', 28.5200000, 77.1587000, 'Diagnostic laboratory test for medical evaluation.', '12 HR', 940, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (88, 'FSH', 'Apollo Diagnostics', 'Vasant Kunj, Delhi', 28.5200000, 77.1587000, 'Diagnostic laboratory test for medical evaluation.', '12 HR', 436, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (104, 'Triglycerides', 'Prognosis Laboratories', 'Vasant Kunj, Delhi', 28.5200000, 77.1587000, 'Diagnostic laboratory test for medical evaluation.', '12 HR', 228, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (112, 'Blood Urea Nitrogen', 'Focus Imaging', 'Vasant Kunj, Delhi', 28.5200000, 77.1587000, 'Diagnostic laboratory test for medical evaluation.', '12 HR', 524, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (75, 'Widal Test', 'City X-Ray & Scan', 'Connaught Place, Delhi', 28.6315000, 77.2167000, 'Diagnostic laboratory test for medical evaluation.', '12 HR', 755, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (83, 'Serum Electrolytes', 'Healthians', 'Connaught Place, Delhi', 28.6315000, 77.2167000, 'Diagnostic laboratory test for medical evaluation.', '12 HR', 251, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (91, 'Liver Function Test', 'Bhasin Medicare', 'Connaught Place, Delhi', 28.6315000, 77.2167000, 'Diagnostic laboratory test for medical evaluation.', '12 HR', 547, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Screening panel checking liver enzymes, bilirubin, and proteins to detect hepatic dysfunction.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (84, 'Hb Electrophoresis', 'Prognosis Laboratories', 'Rohini, Delhi', 28.7041000, 77.1025000, 'Diagnostic laboratory test for medical evaluation.', '12 HR', 288, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (92, 'Kidney Function Test', 'Focus Imaging', 'Rohini, Delhi', 28.7041000, 77.1025000, 'Diagnostic laboratory test for medical evaluation.', '12 HR', 584, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Kidney function panel assessing creatinine, BUN, and electrolytes to evaluate renal health.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (100, 'Calcium', 'Dr. Lal PathLabs', 'Rohini, Delhi', 28.7041000, 77.1025000, 'Diagnostic laboratory test for medical evaluation.', '12 HR', 880, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (108, 'Typhoid IgG/IgM', 'Apollo Diagnostics', 'Rohini, Delhi', 28.7041000, 77.1025000, 'Diagnostic laboratory test for medical evaluation.', '12 HR', 376, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (116, 'Testosterone', 'Pathkind Labs', 'Rohini, Delhi', 28.7041000, 77.1025000, 'Diagnostic laboratory test for medical evaluation.', '12 HR', 672, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (42, 'Full Body Health Checkup (64 Tests)', 'Apollo Diagnostics', 'Dwarka, Delhi', 28.5921000, 77.0460000, 'Comprehensive screening for various vital health parameters.', '24 HR', 1499, 'package', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (49, 'Senior Citizen Package', 'Thyrocare', 'Dwarka, Delhi', 28.5921000, 77.0460000, 'Diagnostic laboratory test for medical evaluation.', '24 HR', 1800, 'package', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (62, 'Kidney Function Test', 'Thyrocare', 'Dwarka, Delhi', 28.5921000, 77.0460000, 'Diagnostic laboratory test for medical evaluation.', '12 HR', 274, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Kidney function panel assessing creatinine, BUN, and electrolytes to evaluate renal health.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (124, 'HbA1c (Glycosylated Hemoglobin)', 'Apollo Diagnostics', 'Vasant Kunj, Delhi', 28.5200000, 77.1587000, 'Measures average blood sugar levels over the past 2-3 months.', '8 HR', 360, 'blood', true, 'Blood Specimen', 'No fasting required. Can be done at any time of the day.', '[{"body": "Provides a reliable average of blood sugar levels over the past 90 days, unaffected by recent meals.", "title": "3-Month Glycemic Tracking"}, {"body": "The gold standard for diagnosing pre-diabetes and monitoring diabetic therapy efficacy.", "title": "Diabetes Diagnosis & Control"}]', '[{"desc": "Percentage of hemoglobin bound to glucose, reflecting long-term sugar stores.", "name": "Glycated Hemoglobin (HbA1c)", "strength": "100%"}, {"desc": "Calculated average blood sugar in mg/dL corresponding to the HbA1c percentage.", "name": "Estimated Average Glucose (eAG)", "strength": "100%"}]', NULL, 'Glycosylated hemoglobin test measuring average blood glucose levels over the past 3 months.', '[{"a": "No, fasting is not required for HbA1c. You can have this test at any time, regardless of when you last ate.", "q": "Do I need to fast for an HbA1c test?"}, {"a": "Regular glucose tests show real-time sugar at that exact second. HbA1c shows a 3-month average, which is much more stable and accurate for diagnostic trends.", "q": "How is HbA1c different from regular blood sugar tests?"}]');
INSERT INTO public.tests VALUES (64, 'Thyroid Profile', 'Prognosis Laboratories', 'Vasant Kunj, Delhi', 28.5200000, 77.1587000, 'Measurement of T3, T4, and TSH levels to evaluate thyroid health.', '12 HR', 348, 'blood', true, 'Blood Specimen', 'No fasting required. Best collected in the morning before taking thyroid medication.', '[{"body": "Screens for overactive (hyperthyroidism) or underactive (hypothyroidism) thyroid gland function.", "title": "Metabolism Clearance Audit"}, {"body": "Tracks T3, T4, and TSH levels to identify systemic sluggishness, fatigue, or unexplained weight shifts.", "title": "Hormonal Balance Check"}]', '[{"desc": "Active thyroid hormone regulating body temperature and metabolic rate.", "name": "T3 (Triiodothyronine)", "strength": "100%"}, {"desc": "Primary thyroid hormone converted by the body into active T3.", "name": "T4 (Thyroxine)", "strength": "100%"}, {"desc": "Pituitary hormone that prompts the thyroid gland to produce T3/T4.", "name": "TSH (Thyroid Stimulating Hormone)", "strength": "100%"}]', NULL, 'Hormone profile assessing T3, T4, and TSH to evaluate thyroid gland activity and metabolic function.', '[{"a": "It is recommended to give your blood sample in the morning before taking your daily thyroid dose, unless advised otherwise by your doctor.", "q": "Should I take my thyroid medicine before the test?"}, {"a": "No, fasting is not mandatory for a basic thyroid profile test. You can eat and drink normally.", "q": "Is fasting required for a Thyroid test?"}]');
INSERT INTO public.tests VALUES (160, 'Apolipoprotein A1', NULL, NULL, NULL, NULL, 'Measures Apolipoprotein A1 to evaluate anti-atherogenic cardiovascular protection capabilities.', '12 Hours', 650, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (161, 'Apolipoprotein B', NULL, NULL, NULL, NULL, 'Evaluates atherogenic particles to audit risk factors for coronary artery blockages.', '12 Hours', 700, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (165, 'Cardio Myoglobin', NULL, NULL, NULL, NULL, 'Measures myoglobin levels to audit acute cardiac cellular integrity.', '4 Hours', 1200, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (166, 'Heart CK-MB Isoenzyme', NULL, NULL, NULL, NULL, 'Evaluates CK-MB levels to track enzyme releases specific to cardiovascular systems.', '6 Hours', 800, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (167, 'Random Blood Sugar (RBS)', NULL, NULL, NULL, NULL, 'Checks glucose values at a random point in time to screen for immediate systemic spikes.', '4 Hours', 99, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (168, 'Fructosamine Sugar Index', NULL, NULL, NULL, NULL, 'Tracks glycated proteins to audit intermediate glucose changes over the past 2-3 weeks.', '12 Hours', 800, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (169, 'Urine Microalbumin Screen', NULL, NULL, NULL, NULL, 'Evaluates trace albumin in urine to audit early renal filtration changes due to sugar levels.', '8 Hours', 450, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (170, 'Oral Glucose Tolerance (OGTT)', NULL, NULL, NULL, NULL, 'Tracks active glucose clearance speeds after administering a calibrated sugar loading dose.', '12 Hours', 350, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (171, 'C-Peptide Insulin Release', NULL, NULL, NULL, NULL, 'Measures C-peptide to audit endogenous insulin secretion capability in pancreatic islet cells.', '12 Hours', 950, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (172, 'Insulin Resistance (HOMA-IR)', NULL, NULL, NULL, NULL, 'Calculates baseline insulin resistance indices to screen metabolic sensitivities.', '12 Hours', 1499, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (173, 'IgE Total (Allergy)', NULL, NULL, NULL, NULL, 'Checks immunoglobulin E stores to identify hypersensitive triggers or basic environmental allergies.', '24 Hours', 599, 'blood', true, 'Blood Specimen', 'No special preparation or fasting is required.', '[{"body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems.", "title": "Clinical Status Evaluation"}, {"body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes.", "title": "Accredited Health Screening"}]', '[{"desc": "Direct measurement of target clinical bio-markers in specimen.", "name": "Primary Parameter", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp.", "q": "How long do reports take for this test?"}, {"a": "Yes, our certified phlebotomists can collect the sample directly from your home or office.", "q": "Is home collection available for this test?"}]');
INSERT INTO public.tests VALUES (19, 'Thyroid Profile (T3, T4, TSH)', 'Bhasin Medicare', 'Greater Kailash, Delhi', 28.5484000, 77.2428000, 'Measurement of T3, T4, and TSH levels to evaluate thyroid health.', '12 HR', 450, 'blood', true, 'Blood Specimen', 'No fasting required. Best collected in the morning before taking thyroid medication.', '[{"body": "Screens for overactive (hyperthyroidism) or underactive (hypothyroidism) thyroid gland function.", "title": "Metabolism Clearance Audit"}, {"body": "Tracks T3, T4, and TSH levels to identify systemic sluggishness, fatigue, or unexplained weight shifts.", "title": "Hormonal Balance Check"}]', '[{"desc": "Active thyroid hormone regulating body temperature and metabolic rate.", "name": "T3 (Triiodothyronine)", "strength": "100%"}, {"desc": "Primary thyroid hormone converted by the body into active T3.", "name": "T4 (Thyroxine)", "strength": "100%"}, {"desc": "Pituitary hormone that prompts the thyroid gland to produce T3/T4.", "name": "TSH (Thyroid Stimulating Hormone)", "strength": "100%"}]', NULL, 'Hormone profile assessing T3, T4, and TSH to evaluate thyroid gland activity and metabolic function.', '[{"a": "It is recommended to give your blood sample in the morning before taking your daily thyroid dose, unless advised otherwise by your doctor.", "q": "Should I take my thyroid medicine before the test?"}, {"a": "No, fasting is not mandatory for a basic thyroid profile test. You can eat and drink normally.", "q": "Is fasting required for a Thyroid test?"}]');
INSERT INTO public.tests VALUES (126, 'HbA1c (Glycosylated Hemoglobin)', 'Thyrocare', 'Laxmi Nagar, Delhi', 28.6304000, 77.2774000, 'Measures average blood sugar levels over the past 2-3 months.', '8 HR', 390, 'blood', true, 'Blood Specimen', 'No fasting required. Can be done at any time of the day.', '[{"body": "Provides a reliable average of blood sugar levels over the past 90 days, unaffected by recent meals.", "title": "3-Month Glycemic Tracking"}, {"body": "The gold standard for diagnosing pre-diabetes and monitoring diabetic therapy efficacy.", "title": "Diabetes Diagnosis & Control"}]', '[{"desc": "Percentage of hemoglobin bound to glucose, reflecting long-term sugar stores.", "name": "Glycated Hemoglobin (HbA1c)", "strength": "100%"}, {"desc": "Calculated average blood sugar in mg/dL corresponding to the HbA1c percentage.", "name": "Estimated Average Glucose (eAG)", "strength": "100%"}]', NULL, 'Glycosylated hemoglobin test measuring average blood glucose levels over the past 3 months.', '[{"a": "No, fasting is not required for HbA1c. You can have this test at any time, regardless of when you last ate.", "q": "Do I need to fast for an HbA1c test?"}, {"a": "Regular glucose tests show real-time sugar at that exact second. HbA1c shows a 3-month average, which is much more stable and accurate for diagnostic trends.", "q": "How is HbA1c different from regular blood sugar tests?"}]');
INSERT INTO public.tests VALUES (123, 'HbA1c (Glycosylated Hemoglobin)', 'Max Lab', 'Saket, Delhi', 28.5245000, 77.2066000, 'Measures average blood sugar levels over the past 2-3 months.', '8 HR', 345, 'blood', true, 'Blood Specimen', 'No fasting required. Can be done at any time of the day.', '[{"body": "Provides a reliable average of blood sugar levels over the past 90 days, unaffected by recent meals.", "title": "3-Month Glycemic Tracking"}, {"body": "The gold standard for diagnosing pre-diabetes and monitoring diabetic therapy efficacy.", "title": "Diabetes Diagnosis & Control"}]', '[{"desc": "Percentage of hemoglobin bound to glucose, reflecting long-term sugar stores.", "name": "Glycated Hemoglobin (HbA1c)", "strength": "100%"}, {"desc": "Calculated average blood sugar in mg/dL corresponding to the HbA1c percentage.", "name": "Estimated Average Glucose (eAG)", "strength": "100%"}]', NULL, 'Glycosylated hemoglobin test measuring average blood glucose levels over the past 3 months.', '[{"a": "No, fasting is not required for HbA1c. You can have this test at any time, regardless of when you last ate.", "q": "Do I need to fast for an HbA1c test?"}, {"a": "Regular glucose tests show real-time sugar at that exact second. HbA1c shows a 3-month average, which is much more stable and accurate for diagnostic trends.", "q": "How is HbA1c different from regular blood sugar tests?"}]');
INSERT INTO public.tests VALUES (94, 'Thyroid Profile', 'Ganesh Diagnostic', 'Dwarka, Delhi', 28.5921000, 77.0460000, 'Measurement of T3, T4, and TSH levels to evaluate thyroid health.', '12 HR', 658, 'blood', true, 'Blood Specimen', 'No fasting required. Best collected in the morning before taking thyroid medication.', '[{"body": "Screens for overactive (hyperthyroidism) or underactive (hypothyroidism) thyroid gland function.", "title": "Metabolism Clearance Audit"}, {"body": "Tracks T3, T4, and TSH levels to identify systemic sluggishness, fatigue, or unexplained weight shifts.", "title": "Hormonal Balance Check"}]', '[{"desc": "Active thyroid hormone regulating body temperature and metabolic rate.", "name": "T3 (Triiodothyronine)", "strength": "100%"}, {"desc": "Primary thyroid hormone converted by the body into active T3.", "name": "T4 (Thyroxine)", "strength": "100%"}, {"desc": "Pituitary hormone that prompts the thyroid gland to produce T3/T4.", "name": "TSH (Thyroid Stimulating Hormone)", "strength": "100%"}]', NULL, 'Hormone profile assessing T3, T4, and TSH to evaluate thyroid gland activity and metabolic function.', '[{"a": "It is recommended to give your blood sample in the morning before taking your daily thyroid dose, unless advised otherwise by your doctor.", "q": "Should I take my thyroid medicine before the test?"}, {"a": "No, fasting is not mandatory for a basic thyroid profile test. You can eat and drink normally.", "q": "Is fasting required for a Thyroid test?"}]');
INSERT INTO public.tests VALUES (17, 'Thyroid Profile (T3, T4, TSH)', 'Pathkind Labs', 'Janakpuri, Delhi', 28.6219000, 77.0878000, 'Measurement of T3, T4, and TSH levels to evaluate thyroid health.', '8 HR', 400, 'blood', true, 'Blood Specimen', 'No fasting required. Best collected in the morning before taking thyroid medication.', '[{"body": "Screens for overactive (hyperthyroidism) or underactive (hypothyroidism) thyroid gland function.", "title": "Metabolism Clearance Audit"}, {"body": "Tracks T3, T4, and TSH levels to identify systemic sluggishness, fatigue, or unexplained weight shifts.", "title": "Hormonal Balance Check"}]', '[{"desc": "Active thyroid hormone regulating body temperature and metabolic rate.", "name": "T3 (Triiodothyronine)", "strength": "100%"}, {"desc": "Primary thyroid hormone converted by the body into active T3.", "name": "T4 (Thyroxine)", "strength": "100%"}, {"desc": "Pituitary hormone that prompts the thyroid gland to produce T3/T4.", "name": "TSH (Thyroid Stimulating Hormone)", "strength": "100%"}]', NULL, 'Hormone profile assessing T3, T4, and TSH to evaluate thyroid gland activity and metabolic function.', '[{"a": "It is recommended to give your blood sample in the morning before taking your daily thyroid dose, unless advised otherwise by your doctor.", "q": "Should I take my thyroid medicine before the test?"}, {"a": "No, fasting is not mandatory for a basic thyroid profile test. You can eat and drink normally.", "q": "Is fasting required for a Thyroid test?"}]');
INSERT INTO public.tests VALUES (122, 'HbA1c (Glycosylated Hemoglobin)', 'Ganesh Diagnostic', 'Dwarka, Delhi', 28.5921000, 77.0460000, 'Measures average blood sugar levels over the past 2-3 months.', '8 HR', 330, 'blood', true, 'Blood Specimen', 'No fasting required. Can be done at any time of the day.', '[{"body": "Provides a reliable average of blood sugar levels over the past 90 days, unaffected by recent meals.", "title": "3-Month Glycemic Tracking"}, {"body": "The gold standard for diagnosing pre-diabetes and monitoring diabetic therapy efficacy.", "title": "Diabetes Diagnosis & Control"}]', '[{"desc": "Percentage of hemoglobin bound to glucose, reflecting long-term sugar stores.", "name": "Glycated Hemoglobin (HbA1c)", "strength": "100%"}, {"desc": "Calculated average blood sugar in mg/dL corresponding to the HbA1c percentage.", "name": "Estimated Average Glucose (eAG)", "strength": "100%"}]', NULL, 'Glycosylated hemoglobin test measuring average blood glucose levels over the past 3 months.', '[{"a": "No, fasting is not required for HbA1c. You can have this test at any time, regardless of when you last ate.", "q": "Do I need to fast for an HbA1c test?"}, {"a": "Regular glucose tests show real-time sugar at that exact second. HbA1c shows a 3-month average, which is much more stable and accurate for diagnostic trends.", "q": "How is HbA1c different from regular blood sugar tests?"}]');
INSERT INTO public.tests VALUES (127, 'HbA1c (Glycosylated Hemoglobin)', 'Dr. Dang Lab', 'Connaught Place, Delhi', 28.6315000, 77.2167000, 'Measures average blood sugar levels over the past 2-3 months.', '8 HR', 405, 'blood', true, 'Blood Specimen', 'No fasting required. Can be done at any time of the day.', '[{"body": "Provides a reliable average of blood sugar levels over the past 90 days, unaffected by recent meals.", "title": "3-Month Glycemic Tracking"}, {"body": "The gold standard for diagnosing pre-diabetes and monitoring diabetic therapy efficacy.", "title": "Diabetes Diagnosis & Control"}]', '[{"desc": "Percentage of hemoglobin bound to glucose, reflecting long-term sugar stores.", "name": "Glycated Hemoglobin (HbA1c)", "strength": "100%"}, {"desc": "Calculated average blood sugar in mg/dL corresponding to the HbA1c percentage.", "name": "Estimated Average Glucose (eAG)", "strength": "100%"}]', NULL, 'Glycosylated hemoglobin test measuring average blood glucose levels over the past 3 months.', '[{"a": "No, fasting is not required for HbA1c. You can have this test at any time, regardless of when you last ate.", "q": "Do I need to fast for an HbA1c test?"}, {"a": "Regular glucose tests show real-time sugar at that exact second. HbA1c shows a 3-month average, which is much more stable and accurate for diagnostic trends.", "q": "How is HbA1c different from regular blood sugar tests?"}]');
INSERT INTO public.tests VALUES (120, 'HbA1c (Glycosylated Hemoglobin)', 'Dr. Lal PathLabs', 'Rohini, Delhi', 28.7041000, 77.1025000, 'Measures average blood sugar levels over the past 2-3 months.', '8 HR', 300, 'blood', true, 'Blood Specimen', 'No fasting required. Can be done at any time of the day.', '[{"body": "Provides a reliable average of blood sugar levels over the past 90 days, unaffected by recent meals.", "title": "3-Month Glycemic Tracking"}, {"body": "The gold standard for diagnosing pre-diabetes and monitoring diabetic therapy efficacy.", "title": "Diabetes Diagnosis & Control"}]', '[{"desc": "Percentage of hemoglobin bound to glucose, reflecting long-term sugar stores.", "name": "Glycated Hemoglobin (HbA1c)", "strength": "100%"}, {"desc": "Calculated average blood sugar in mg/dL corresponding to the HbA1c percentage.", "name": "Estimated Average Glucose (eAG)", "strength": "100%"}]', NULL, 'Glycosylated hemoglobin test measuring average blood glucose levels over the past 3 months.', '[{"a": "No, fasting is not required for HbA1c. You can have this test at any time, regardless of when you last ate.", "q": "Do I need to fast for an HbA1c test?"}, {"a": "Regular glucose tests show real-time sugar at that exact second. HbA1c shows a 3-month average, which is much more stable and accurate for diagnostic trends.", "q": "How is HbA1c different from regular blood sugar tests?"}]');
INSERT INTO public.tests VALUES (21, 'HbA1c (Glycosylated Hemoglobin)', 'Thyrocare', 'Okhla, Delhi', 28.5355000, 77.2868000, 'Measures average blood sugar levels over the past 2-3 months.', '8 HR', 300, 'blood', true, 'Blood Specimen', 'No fasting required. Can be done at any time of the day.', '[{"body": "Provides a reliable average of blood sugar levels over the past 90 days, unaffected by recent meals.", "title": "3-Month Glycemic Tracking"}, {"body": "The gold standard for diagnosing pre-diabetes and monitoring diabetic therapy efficacy.", "title": "Diabetes Diagnosis & Control"}]', '[{"desc": "Percentage of hemoglobin bound to glucose, reflecting long-term sugar stores.", "name": "Glycated Hemoglobin (HbA1c)", "strength": "100%"}, {"desc": "Calculated average blood sugar in mg/dL corresponding to the HbA1c percentage.", "name": "Estimated Average Glucose (eAG)", "strength": "100%"}]', NULL, 'Glycosylated hemoglobin test measuring average blood glucose levels over the past 3 months.', '[{"a": "No, fasting is not required for HbA1c. You can have this test at any time, regardless of when you last ate.", "q": "Do I need to fast for an HbA1c test?"}, {"a": "Regular glucose tests show real-time sugar at that exact second. HbA1c shows a 3-month average, which is much more stable and accurate for diagnostic trends.", "q": "How is HbA1c different from regular blood sugar tests?"}]');
INSERT INTO public.tests VALUES (128, 'HbA1c (Glycosylated Hemoglobin)', 'Pathkind Labs', 'Rohini, Delhi', 28.7041000, 77.1025000, 'Measures average blood sugar levels over the past 2-3 months.', '8 HR', 420, 'blood', true, 'Blood Specimen', 'No fasting required. Can be done at any time of the day.', '[{"body": "Provides a reliable average of blood sugar levels over the past 90 days, unaffected by recent meals.", "title": "3-Month Glycemic Tracking"}, {"body": "The gold standard for diagnosing pre-diabetes and monitoring diabetic therapy efficacy.", "title": "Diabetes Diagnosis & Control"}]', '[{"desc": "Percentage of hemoglobin bound to glucose, reflecting long-term sugar stores.", "name": "Glycated Hemoglobin (HbA1c)", "strength": "100%"}, {"desc": "Calculated average blood sugar in mg/dL corresponding to the HbA1c percentage.", "name": "Estimated Average Glucose (eAG)", "strength": "100%"}]', NULL, 'Glycosylated hemoglobin test measuring average blood glucose levels over the past 3 months.', '[{"a": "No, fasting is not required for HbA1c. You can have this test at any time, regardless of when you last ate.", "q": "Do I need to fast for an HbA1c test?"}, {"a": "Regular glucose tests show real-time sugar at that exact second. HbA1c shows a 3-month average, which is much more stable and accurate for diagnostic trends.", "q": "How is HbA1c different from regular blood sugar tests?"}]');
INSERT INTO public.tests VALUES (136, 'HbA1c (Glycosylated Hemoglobin)', 'Focus Imaging', 'Rohini, Delhi', 28.7041000, 77.1025000, 'Measures average blood sugar levels over the past 2-3 months.', '8 HR', 540, 'blood', true, 'Blood Specimen', 'No fasting required. Can be done at any time of the day.', '[{"body": "Provides a reliable average of blood sugar levels over the past 90 days, unaffected by recent meals.", "title": "3-Month Glycemic Tracking"}, {"body": "The gold standard for diagnosing pre-diabetes and monitoring diabetic therapy efficacy.", "title": "Diabetes Diagnosis & Control"}]', '[{"desc": "Percentage of hemoglobin bound to glucose, reflecting long-term sugar stores.", "name": "Glycated Hemoglobin (HbA1c)", "strength": "100%"}, {"desc": "Calculated average blood sugar in mg/dL corresponding to the HbA1c percentage.", "name": "Estimated Average Glucose (eAG)", "strength": "100%"}]', NULL, 'Glycosylated hemoglobin test measuring average blood glucose levels over the past 3 months.', '[{"a": "No, fasting is not required for HbA1c. You can have this test at any time, regardless of when you last ate.", "q": "Do I need to fast for an HbA1c test?"}, {"a": "Regular glucose tests show real-time sugar at that exact second. HbA1c shows a 3-month average, which is much more stable and accurate for diagnostic trends.", "q": "How is HbA1c different from regular blood sugar tests?"}]');
INSERT INTO public.tests VALUES (144, 'HbA1c (Glycosylated Hemoglobin)', 'Apollo Diagnostics Branch 24', 'Rohini, Delhi', 28.7041000, 77.1025000, 'Measures average blood sugar levels over the past 2-3 months.', '8 HR', 660, 'blood', true, 'Blood Specimen', 'No fasting required. Can be done at any time of the day.', '[{"body": "Provides a reliable average of blood sugar levels over the past 90 days, unaffected by recent meals.", "title": "3-Month Glycemic Tracking"}, {"body": "The gold standard for diagnosing pre-diabetes and monitoring diabetic therapy efficacy.", "title": "Diabetes Diagnosis & Control"}]', '[{"desc": "Percentage of hemoglobin bound to glucose, reflecting long-term sugar stores.", "name": "Glycated Hemoglobin (HbA1c)", "strength": "100%"}, {"desc": "Calculated average blood sugar in mg/dL corresponding to the HbA1c percentage.", "name": "Estimated Average Glucose (eAG)", "strength": "100%"}]', NULL, 'Glycosylated hemoglobin test measuring average blood glucose levels over the past 3 months.', '[{"a": "No, fasting is not required for HbA1c. You can have this test at any time, regardless of when you last ate.", "q": "Do I need to fast for an HbA1c test?"}, {"a": "Regular glucose tests show real-time sugar at that exact second. HbA1c shows a 3-month average, which is much more stable and accurate for diagnostic trends.", "q": "How is HbA1c different from regular blood sugar tests?"}]');
INSERT INTO public.tests VALUES (129, 'HbA1c (Glycosylated Hemoglobin)', 'Healthians', 'Pitampura, Delhi', 28.6990000, 77.1384000, 'Measures average blood sugar levels over the past 2-3 months.', '8 HR', 435, 'blood', true, 'Blood Specimen', 'No fasting required. Can be done at any time of the day.', '[{"body": "Provides a reliable average of blood sugar levels over the past 90 days, unaffected by recent meals.", "title": "3-Month Glycemic Tracking"}, {"body": "The gold standard for diagnosing pre-diabetes and monitoring diabetic therapy efficacy.", "title": "Diabetes Diagnosis & Control"}]', '[{"desc": "Percentage of hemoglobin bound to glucose, reflecting long-term sugar stores.", "name": "Glycated Hemoglobin (HbA1c)", "strength": "100%"}, {"desc": "Calculated average blood sugar in mg/dL corresponding to the HbA1c percentage.", "name": "Estimated Average Glucose (eAG)", "strength": "100%"}]', NULL, 'Glycosylated hemoglobin test measuring average blood glucose levels over the past 3 months.', '[{"a": "No, fasting is not required for HbA1c. You can have this test at any time, regardless of when you last ate.", "q": "Do I need to fast for an HbA1c test?"}, {"a": "Regular glucose tests show real-time sugar at that exact second. HbA1c shows a 3-month average, which is much more stable and accurate for diagnostic trends.", "q": "How is HbA1c different from regular blood sugar tests?"}]');
INSERT INTO public.tests VALUES (137, 'HbA1c (Glycosylated Hemoglobin)', 'Metro Diagnostics', 'Pitampura, Delhi', 28.6990000, 77.1384000, 'Measures average blood sugar levels over the past 2-3 months.', '8 HR', 555, 'blood', true, 'Blood Specimen', 'No fasting required. Can be done at any time of the day.', '[{"body": "Provides a reliable average of blood sugar levels over the past 90 days, unaffected by recent meals.", "title": "3-Month Glycemic Tracking"}, {"body": "The gold standard for diagnosing pre-diabetes and monitoring diabetic therapy efficacy.", "title": "Diabetes Diagnosis & Control"}]', '[{"desc": "Percentage of hemoglobin bound to glucose, reflecting long-term sugar stores.", "name": "Glycated Hemoglobin (HbA1c)", "strength": "100%"}, {"desc": "Calculated average blood sugar in mg/dL corresponding to the HbA1c percentage.", "name": "Estimated Average Glucose (eAG)", "strength": "100%"}]', NULL, 'Glycosylated hemoglobin test measuring average blood glucose levels over the past 3 months.', '[{"a": "No, fasting is not required for HbA1c. You can have this test at any time, regardless of when you last ate.", "q": "Do I need to fast for an HbA1c test?"}, {"a": "Regular glucose tests show real-time sugar at that exact second. HbA1c shows a 3-month average, which is much more stable and accurate for diagnostic trends.", "q": "How is HbA1c different from regular blood sugar tests?"}]');
INSERT INTO public.tests VALUES (145, 'HbA1c (Glycosylated Hemoglobin)', 'City X-Ray & Scan Branch 25', 'Pitampura, Delhi', 28.6990000, 77.1384000, 'Measures average blood sugar levels over the past 2-3 months.', '8 HR', 675, 'blood', true, 'Blood Specimen', 'No fasting required. Can be done at any time of the day.', '[{"body": "Provides a reliable average of blood sugar levels over the past 90 days, unaffected by recent meals.", "title": "3-Month Glycemic Tracking"}, {"body": "The gold standard for diagnosing pre-diabetes and monitoring diabetic therapy efficacy.", "title": "Diabetes Diagnosis & Control"}]', '[{"desc": "Percentage of hemoglobin bound to glucose, reflecting long-term sugar stores.", "name": "Glycated Hemoglobin (HbA1c)", "strength": "100%"}, {"desc": "Calculated average blood sugar in mg/dL corresponding to the HbA1c percentage.", "name": "Estimated Average Glucose (eAG)", "strength": "100%"}]', NULL, 'Glycosylated hemoglobin test measuring average blood glucose levels over the past 3 months.', '[{"a": "No, fasting is not required for HbA1c. You can have this test at any time, regardless of when you last ate.", "q": "Do I need to fast for an HbA1c test?"}, {"a": "Regular glucose tests show real-time sugar at that exact second. HbA1c shows a 3-month average, which is much more stable and accurate for diagnostic trends.", "q": "How is HbA1c different from regular blood sugar tests?"}]');
INSERT INTO public.tests VALUES (142, 'HbA1c (Glycosylated Hemoglobin)', 'Ganesh Diagnostic Branch 22', 'Laxmi Nagar, Delhi', 28.6304000, 77.2774000, 'Measures average blood sugar levels over the past 2-3 months.', '8 HR', 630, 'blood', true, 'Blood Specimen', 'No fasting required. Can be done at any time of the day.', '[{"body": "Provides a reliable average of blood sugar levels over the past 90 days, unaffected by recent meals.", "title": "3-Month Glycemic Tracking"}, {"body": "The gold standard for diagnosing pre-diabetes and monitoring diabetic therapy efficacy.", "title": "Diabetes Diagnosis & Control"}]', '[{"desc": "Percentage of hemoglobin bound to glucose, reflecting long-term sugar stores.", "name": "Glycated Hemoglobin (HbA1c)", "strength": "100%"}, {"desc": "Calculated average blood sugar in mg/dL corresponding to the HbA1c percentage.", "name": "Estimated Average Glucose (eAG)", "strength": "100%"}]', NULL, 'Glycosylated hemoglobin test measuring average blood glucose levels over the past 3 months.', '[{"a": "No, fasting is not required for HbA1c. You can have this test at any time, regardless of when you last ate.", "q": "Do I need to fast for an HbA1c test?"}, {"a": "Regular glucose tests show real-time sugar at that exact second. HbA1c shows a 3-month average, which is much more stable and accurate for diagnostic trends.", "q": "How is HbA1c different from regular blood sugar tests?"}]');
INSERT INTO public.tests VALUES (131, 'HbA1c (Glycosylated Hemoglobin)', 'House of Diagnostics (HOD)', 'Saket, Delhi', 28.5245000, 77.2066000, 'Measures average blood sugar levels over the past 2-3 months.', '8 HR', 465, 'blood', true, 'Blood Specimen', 'No fasting required. Can be done at any time of the day.', '[{"body": "Provides a reliable average of blood sugar levels over the past 90 days, unaffected by recent meals.", "title": "3-Month Glycemic Tracking"}, {"body": "The gold standard for diagnosing pre-diabetes and monitoring diabetic therapy efficacy.", "title": "Diabetes Diagnosis & Control"}]', '[{"desc": "Percentage of hemoglobin bound to glucose, reflecting long-term sugar stores.", "name": "Glycated Hemoglobin (HbA1c)", "strength": "100%"}, {"desc": "Calculated average blood sugar in mg/dL corresponding to the HbA1c percentage.", "name": "Estimated Average Glucose (eAG)", "strength": "100%"}]', NULL, 'Glycosylated hemoglobin test measuring average blood glucose levels over the past 3 months.', '[{"a": "No, fasting is not required for HbA1c. You can have this test at any time, regardless of when you last ate.", "q": "Do I need to fast for an HbA1c test?"}, {"a": "Regular glucose tests show real-time sugar at that exact second. HbA1c shows a 3-month average, which is much more stable and accurate for diagnostic trends.", "q": "How is HbA1c different from regular blood sugar tests?"}]');
INSERT INTO public.tests VALUES (139, 'HbA1c (Glycosylated Hemoglobin)', 'Mahajan Imaging', 'Saket, Delhi', 28.5245000, 77.2066000, 'Measures average blood sugar levels over the past 2-3 months.', '8 HR', 585, 'blood', true, 'Blood Specimen', 'No fasting required. Can be done at any time of the day.', '[{"body": "Provides a reliable average of blood sugar levels over the past 90 days, unaffected by recent meals.", "title": "3-Month Glycemic Tracking"}, {"body": "The gold standard for diagnosing pre-diabetes and monitoring diabetic therapy efficacy.", "title": "Diabetes Diagnosis & Control"}]', '[{"desc": "Percentage of hemoglobin bound to glucose, reflecting long-term sugar stores.", "name": "Glycated Hemoglobin (HbA1c)", "strength": "100%"}, {"desc": "Calculated average blood sugar in mg/dL corresponding to the HbA1c percentage.", "name": "Estimated Average Glucose (eAG)", "strength": "100%"}]', NULL, 'Glycosylated hemoglobin test measuring average blood glucose levels over the past 3 months.', '[{"a": "No, fasting is not required for HbA1c. You can have this test at any time, regardless of when you last ate.", "q": "Do I need to fast for an HbA1c test?"}, {"a": "Regular glucose tests show real-time sugar at that exact second. HbA1c shows a 3-month average, which is much more stable and accurate for diagnostic trends.", "q": "How is HbA1c different from regular blood sugar tests?"}]');
INSERT INTO public.tests VALUES (147, 'HbA1c (Glycosylated Hemoglobin)', 'Dr. Dang Lab Branch 27', 'Saket, Delhi', 28.5245000, 77.2066000, 'Measures average blood sugar levels over the past 2-3 months.', '8 HR', 705, 'blood', true, 'Blood Specimen', 'No fasting required. Can be done at any time of the day.', '[{"body": "Provides a reliable average of blood sugar levels over the past 90 days, unaffected by recent meals.", "title": "3-Month Glycemic Tracking"}, {"body": "The gold standard for diagnosing pre-diabetes and monitoring diabetic therapy efficacy.", "title": "Diabetes Diagnosis & Control"}]', '[{"desc": "Percentage of hemoglobin bound to glucose, reflecting long-term sugar stores.", "name": "Glycated Hemoglobin (HbA1c)", "strength": "100%"}, {"desc": "Calculated average blood sugar in mg/dL corresponding to the HbA1c percentage.", "name": "Estimated Average Glucose (eAG)", "strength": "100%"}]', NULL, 'Glycosylated hemoglobin test measuring average blood glucose levels over the past 3 months.', '[{"a": "No, fasting is not required for HbA1c. You can have this test at any time, regardless of when you last ate.", "q": "Do I need to fast for an HbA1c test?"}, {"a": "Regular glucose tests show real-time sugar at that exact second. HbA1c shows a 3-month average, which is much more stable and accurate for diagnostic trends.", "q": "How is HbA1c different from regular blood sugar tests?"}]');
INSERT INTO public.tests VALUES (130, 'HbA1c (Glycosylated Hemoglobin)', 'Redcliffe Labs', 'Dwarka, Delhi', 28.5921000, 77.0460000, 'Measures average blood sugar levels over the past 2-3 months.', '8 HR', 450, 'blood', true, 'Blood Specimen', 'No fasting required. Can be done at any time of the day.', '[{"body": "Provides a reliable average of blood sugar levels over the past 90 days, unaffected by recent meals.", "title": "3-Month Glycemic Tracking"}, {"body": "The gold standard for diagnosing pre-diabetes and monitoring diabetic therapy efficacy.", "title": "Diabetes Diagnosis & Control"}]', '[{"desc": "Percentage of hemoglobin bound to glucose, reflecting long-term sugar stores.", "name": "Glycated Hemoglobin (HbA1c)", "strength": "100%"}, {"desc": "Calculated average blood sugar in mg/dL corresponding to the HbA1c percentage.", "name": "Estimated Average Glucose (eAG)", "strength": "100%"}]', NULL, 'Glycosylated hemoglobin test measuring average blood glucose levels over the past 3 months.', '[{"a": "No, fasting is not required for HbA1c. You can have this test at any time, regardless of when you last ate.", "q": "Do I need to fast for an HbA1c test?"}, {"a": "Regular glucose tests show real-time sugar at that exact second. HbA1c shows a 3-month average, which is much more stable and accurate for diagnostic trends.", "q": "How is HbA1c different from regular blood sugar tests?"}]');
INSERT INTO public.tests VALUES (138, 'HbA1c (Glycosylated Hemoglobin)', 'Modern Diagnostic', 'Dwarka, Delhi', 28.5921000, 77.0460000, 'Measures average blood sugar levels over the past 2-3 months.', '8 HR', 570, 'blood', true, 'Blood Specimen', 'No fasting required. Can be done at any time of the day.', '[{"body": "Provides a reliable average of blood sugar levels over the past 90 days, unaffected by recent meals.", "title": "3-Month Glycemic Tracking"}, {"body": "The gold standard for diagnosing pre-diabetes and monitoring diabetic therapy efficacy.", "title": "Diabetes Diagnosis & Control"}]', '[{"desc": "Percentage of hemoglobin bound to glucose, reflecting long-term sugar stores.", "name": "Glycated Hemoglobin (HbA1c)", "strength": "100%"}, {"desc": "Calculated average blood sugar in mg/dL corresponding to the HbA1c percentage.", "name": "Estimated Average Glucose (eAG)", "strength": "100%"}]', NULL, 'Glycosylated hemoglobin test measuring average blood glucose levels over the past 3 months.', '[{"a": "No, fasting is not required for HbA1c. You can have this test at any time, regardless of when you last ate.", "q": "Do I need to fast for an HbA1c test?"}, {"a": "Regular glucose tests show real-time sugar at that exact second. HbA1c shows a 3-month average, which is much more stable and accurate for diagnostic trends.", "q": "How is HbA1c different from regular blood sugar tests?"}]');
INSERT INTO public.tests VALUES (146, 'HbA1c (Glycosylated Hemoglobin)', 'Thyrocare Branch 26', 'Dwarka, Delhi', 28.5921000, 77.0460000, 'Measures average blood sugar levels over the past 2-3 months.', '8 HR', 690, 'blood', true, 'Blood Specimen', 'No fasting required. Can be done at any time of the day.', '[{"body": "Provides a reliable average of blood sugar levels over the past 90 days, unaffected by recent meals.", "title": "3-Month Glycemic Tracking"}, {"body": "The gold standard for diagnosing pre-diabetes and monitoring diabetic therapy efficacy.", "title": "Diabetes Diagnosis & Control"}]', '[{"desc": "Percentage of hemoglobin bound to glucose, reflecting long-term sugar stores.", "name": "Glycated Hemoglobin (HbA1c)", "strength": "100%"}, {"desc": "Calculated average blood sugar in mg/dL corresponding to the HbA1c percentage.", "name": "Estimated Average Glucose (eAG)", "strength": "100%"}]', NULL, 'Glycosylated hemoglobin test measuring average blood glucose levels over the past 3 months.', '[{"a": "No, fasting is not required for HbA1c. You can have this test at any time, regardless of when you last ate.", "q": "Do I need to fast for an HbA1c test?"}, {"a": "Regular glucose tests show real-time sugar at that exact second. HbA1c shows a 3-month average, which is much more stable and accurate for diagnostic trends.", "q": "How is HbA1c different from regular blood sugar tests?"}]');
INSERT INTO public.tests VALUES (132, 'HbA1c (Glycosylated Hemoglobin)', 'Prognosis Laboratories', 'Vasant Kunj, Delhi', 28.5200000, 77.1587000, 'Measures average blood sugar levels over the past 2-3 months.', '8 HR', 480, 'blood', true, 'Blood Specimen', 'No fasting required. Can be done at any time of the day.', '[{"body": "Provides a reliable average of blood sugar levels over the past 90 days, unaffected by recent meals.", "title": "3-Month Glycemic Tracking"}, {"body": "The gold standard for diagnosing pre-diabetes and monitoring diabetic therapy efficacy.", "title": "Diabetes Diagnosis & Control"}]', '[{"desc": "Percentage of hemoglobin bound to glucose, reflecting long-term sugar stores.", "name": "Glycated Hemoglobin (HbA1c)", "strength": "100%"}, {"desc": "Calculated average blood sugar in mg/dL corresponding to the HbA1c percentage.", "name": "Estimated Average Glucose (eAG)", "strength": "100%"}]', NULL, 'Glycosylated hemoglobin test measuring average blood glucose levels over the past 3 months.', '[{"a": "No, fasting is not required for HbA1c. You can have this test at any time, regardless of when you last ate.", "q": "Do I need to fast for an HbA1c test?"}, {"a": "Regular glucose tests show real-time sugar at that exact second. HbA1c shows a 3-month average, which is much more stable and accurate for diagnostic trends.", "q": "How is HbA1c different from regular blood sugar tests?"}]');
INSERT INTO public.tests VALUES (121, 'HbA1c (Glycosylated Hemoglobin)', 'SRL Diagnostics', 'Pitampura, Delhi', 28.6990000, 77.1384000, 'Measures average blood sugar levels over the past 2-3 months.', '8 HR', 315, 'blood', true, 'Blood Specimen', 'No fasting required. Can be done at any time of the day.', '[{"body": "Provides a reliable average of blood sugar levels over the past 90 days, unaffected by recent meals.", "title": "3-Month Glycemic Tracking"}, {"body": "The gold standard for diagnosing pre-diabetes and monitoring diabetic therapy efficacy.", "title": "Diabetes Diagnosis & Control"}]', '[{"desc": "Percentage of hemoglobin bound to glucose, reflecting long-term sugar stores.", "name": "Glycated Hemoglobin (HbA1c)", "strength": "100%"}, {"desc": "Calculated average blood sugar in mg/dL corresponding to the HbA1c percentage.", "name": "Estimated Average Glucose (eAG)", "strength": "100%"}]', NULL, 'Glycosylated hemoglobin test measuring average blood glucose levels over the past 3 months.', '[{"a": "No, fasting is not required for HbA1c. You can have this test at any time, regardless of when you last ate.", "q": "Do I need to fast for an HbA1c test?"}, {"a": "Regular glucose tests show real-time sugar at that exact second. HbA1c shows a 3-month average, which is much more stable and accurate for diagnostic trends.", "q": "How is HbA1c different from regular blood sugar tests?"}]');
INSERT INTO public.tests VALUES (141, 'HbA1c (Glycosylated Hemoglobin)', 'SRL Diagnostics Branch 21', 'Janakpuri, Delhi', 28.6219000, 77.0878000, 'Measures average blood sugar levels over the past 2-3 months.', '8 HR', 615, 'blood', true, 'Blood Specimen', 'No fasting required. Can be done at any time of the day.', '[{"body": "Provides a reliable average of blood sugar levels over the past 90 days, unaffected by recent meals.", "title": "3-Month Glycemic Tracking"}, {"body": "The gold standard for diagnosing pre-diabetes and monitoring diabetic therapy efficacy.", "title": "Diabetes Diagnosis & Control"}]', '[{"desc": "Percentage of hemoglobin bound to glucose, reflecting long-term sugar stores.", "name": "Glycated Hemoglobin (HbA1c)", "strength": "100%"}, {"desc": "Calculated average blood sugar in mg/dL corresponding to the HbA1c percentage.", "name": "Estimated Average Glucose (eAG)", "strength": "100%"}]', NULL, 'Glycosylated hemoglobin test measuring average blood glucose levels over the past 3 months.', '[{"a": "No, fasting is not required for HbA1c. You can have this test at any time, regardless of when you last ate.", "q": "Do I need to fast for an HbA1c test?"}, {"a": "Regular glucose tests show real-time sugar at that exact second. HbA1c shows a 3-month average, which is much more stable and accurate for diagnostic trends.", "q": "How is HbA1c different from regular blood sugar tests?"}]');
INSERT INTO public.tests VALUES (149, 'HbA1c (Glycosylated Hemoglobin)', 'Healthians Branch 29', 'Janakpuri, Delhi', 28.6219000, 77.0878000, 'Measures average blood sugar levels over the past 2-3 months.', '8 HR', 735, 'blood', true, 'Blood Specimen', 'No fasting required. Can be done at any time of the day.', '[{"body": "Provides a reliable average of blood sugar levels over the past 90 days, unaffected by recent meals.", "title": "3-Month Glycemic Tracking"}, {"body": "The gold standard for diagnosing pre-diabetes and monitoring diabetic therapy efficacy.", "title": "Diabetes Diagnosis & Control"}]', '[{"desc": "Percentage of hemoglobin bound to glucose, reflecting long-term sugar stores.", "name": "Glycated Hemoglobin (HbA1c)", "strength": "100%"}, {"desc": "Calculated average blood sugar in mg/dL corresponding to the HbA1c percentage.", "name": "Estimated Average Glucose (eAG)", "strength": "100%"}]', NULL, 'Glycosylated hemoglobin test measuring average blood glucose levels over the past 3 months.', '[{"a": "No, fasting is not required for HbA1c. You can have this test at any time, regardless of when you last ate.", "q": "Do I need to fast for an HbA1c test?"}, {"a": "Regular glucose tests show real-time sugar at that exact second. HbA1c shows a 3-month average, which is much more stable and accurate for diagnostic trends.", "q": "How is HbA1c different from regular blood sugar tests?"}]');
INSERT INTO public.tests VALUES (148, 'HbA1c (Glycosylated Hemoglobin)', 'Pathkind Labs Branch 28', 'Vasant Kunj, Delhi', 28.5200000, 77.1587000, 'Measures average blood sugar levels over the past 2-3 months.', '8 HR', 720, 'blood', true, 'Blood Specimen', 'No fasting required. Can be done at any time of the day.', '[{"body": "Provides a reliable average of blood sugar levels over the past 90 days, unaffected by recent meals.", "title": "3-Month Glycemic Tracking"}, {"body": "The gold standard for diagnosing pre-diabetes and monitoring diabetic therapy efficacy.", "title": "Diabetes Diagnosis & Control"}]', '[{"desc": "Percentage of hemoglobin bound to glucose, reflecting long-term sugar stores.", "name": "Glycated Hemoglobin (HbA1c)", "strength": "100%"}, {"desc": "Calculated average blood sugar in mg/dL corresponding to the HbA1c percentage.", "name": "Estimated Average Glucose (eAG)", "strength": "100%"}]', NULL, 'Glycosylated hemoglobin test measuring average blood glucose levels over the past 3 months.', '[{"a": "No, fasting is not required for HbA1c. You can have this test at any time, regardless of when you last ate.", "q": "Do I need to fast for an HbA1c test?"}, {"a": "Regular glucose tests show real-time sugar at that exact second. HbA1c shows a 3-month average, which is much more stable and accurate for diagnostic trends.", "q": "How is HbA1c different from regular blood sugar tests?"}]');
INSERT INTO public.tests VALUES (135, 'HbA1c (Glycosylated Hemoglobin)', 'Star Imaging', 'Connaught Place, Delhi', 28.6315000, 77.2167000, 'Measures average blood sugar levels over the past 2-3 months.', '8 HR', 525, 'blood', true, 'Blood Specimen', 'No fasting required. Can be done at any time of the day.', '[{"body": "Provides a reliable average of blood sugar levels over the past 90 days, unaffected by recent meals.", "title": "3-Month Glycemic Tracking"}, {"body": "The gold standard for diagnosing pre-diabetes and monitoring diabetic therapy efficacy.", "title": "Diabetes Diagnosis & Control"}]', '[{"desc": "Percentage of hemoglobin bound to glucose, reflecting long-term sugar stores.", "name": "Glycated Hemoglobin (HbA1c)", "strength": "100%"}, {"desc": "Calculated average blood sugar in mg/dL corresponding to the HbA1c percentage.", "name": "Estimated Average Glucose (eAG)", "strength": "100%"}]', NULL, 'Glycosylated hemoglobin test measuring average blood glucose levels over the past 3 months.', '[{"a": "No, fasting is not required for HbA1c. You can have this test at any time, regardless of when you last ate.", "q": "Do I need to fast for an HbA1c test?"}, {"a": "Regular glucose tests show real-time sugar at that exact second. HbA1c shows a 3-month average, which is much more stable and accurate for diagnostic trends.", "q": "How is HbA1c different from regular blood sugar tests?"}]');
INSERT INTO public.tests VALUES (140, 'HbA1c (Glycosylated Hemoglobin)', 'Dr. Lal PathLabs Branch 20', 'Vasant Kunj, Delhi', 28.5200000, 77.1587000, 'Measures average blood sugar levels over the past 2-3 months.', '8 HR', 600, 'blood', true, 'Blood Specimen', 'No fasting required. Can be done at any time of the day.', '[{"body": "Provides a reliable average of blood sugar levels over the past 90 days, unaffected by recent meals.", "title": "3-Month Glycemic Tracking"}, {"body": "The gold standard for diagnosing pre-diabetes and monitoring diabetic therapy efficacy.", "title": "Diabetes Diagnosis & Control"}]', '[{"desc": "Percentage of hemoglobin bound to glucose, reflecting long-term sugar stores.", "name": "Glycated Hemoglobin (HbA1c)", "strength": "100%"}, {"desc": "Calculated average blood sugar in mg/dL corresponding to the HbA1c percentage.", "name": "Estimated Average Glucose (eAG)", "strength": "100%"}]', NULL, 'Glycosylated hemoglobin test measuring average blood glucose levels over the past 3 months.', '[{"a": "No, fasting is not required for HbA1c. You can have this test at any time, regardless of when you last ate.", "q": "Do I need to fast for an HbA1c test?"}, {"a": "Regular glucose tests show real-time sugar at that exact second. HbA1c shows a 3-month average, which is much more stable and accurate for diagnostic trends.", "q": "How is HbA1c different from regular blood sugar tests?"}]');
INSERT INTO public.tests VALUES (134, 'HbA1c (Glycosylated Hemoglobin)', 'Saral Advanced', 'Laxmi Nagar, Delhi', 28.6304000, 77.2774000, 'Measures average blood sugar levels over the past 2-3 months.', '8 HR', 510, 'blood', true, 'Blood Specimen', 'No fasting required. Can be done at any time of the day.', '[{"body": "Provides a reliable average of blood sugar levels over the past 90 days, unaffected by recent meals.", "title": "3-Month Glycemic Tracking"}, {"body": "The gold standard for diagnosing pre-diabetes and monitoring diabetic therapy efficacy.", "title": "Diabetes Diagnosis & Control"}]', '[{"desc": "Percentage of hemoglobin bound to glucose, reflecting long-term sugar stores.", "name": "Glycated Hemoglobin (HbA1c)", "strength": "100%"}, {"desc": "Calculated average blood sugar in mg/dL corresponding to the HbA1c percentage.", "name": "Estimated Average Glucose (eAG)", "strength": "100%"}]', NULL, 'Glycosylated hemoglobin test measuring average blood glucose levels over the past 3 months.', '[{"a": "No, fasting is not required for HbA1c. You can have this test at any time, regardless of when you last ate.", "q": "Do I need to fast for an HbA1c test?"}, {"a": "Regular glucose tests show real-time sugar at that exact second. HbA1c shows a 3-month average, which is much more stable and accurate for diagnostic trends.", "q": "How is HbA1c different from regular blood sugar tests?"}]');
INSERT INTO public.tests VALUES (143, 'HbA1c (Glycosylated Hemoglobin)', 'Max Lab Branch 23', 'Connaught Place, Delhi', 28.6315000, 77.2167000, 'Measures average blood sugar levels over the past 2-3 months.', '8 HR', 645, 'blood', true, 'Blood Specimen', 'No fasting required. Can be done at any time of the day.', '[{"body": "Provides a reliable average of blood sugar levels over the past 90 days, unaffected by recent meals.", "title": "3-Month Glycemic Tracking"}, {"body": "The gold standard for diagnosing pre-diabetes and monitoring diabetic therapy efficacy.", "title": "Diabetes Diagnosis & Control"}]', '[{"desc": "Percentage of hemoglobin bound to glucose, reflecting long-term sugar stores.", "name": "Glycated Hemoglobin (HbA1c)", "strength": "100%"}, {"desc": "Calculated average blood sugar in mg/dL corresponding to the HbA1c percentage.", "name": "Estimated Average Glucose (eAG)", "strength": "100%"}]', NULL, 'Glycosylated hemoglobin test measuring average blood glucose levels over the past 3 months.', '[{"a": "No, fasting is not required for HbA1c. You can have this test at any time, regardless of when you last ate.", "q": "Do I need to fast for an HbA1c test?"}, {"a": "Regular glucose tests show real-time sugar at that exact second. HbA1c shows a 3-month average, which is much more stable and accurate for diagnostic trends.", "q": "How is HbA1c different from regular blood sugar tests?"}]');
INSERT INTO public.tests VALUES (66, 'Fasting Blood Sugar', 'Modern Diagnostic', 'Laxmi Nagar, Delhi', 28.6304000, 77.2774000, 'Diagnostic laboratory test for medical evaluation.', '12 HR', 422, 'blood', true, 'Blood Specimen', 'Requires strict 8-10 hours overnight fasting. No food or drinks except plain water.', '[{"body": "Measures basic circulating glucose levels after fasting to check insulin release efficiency.", "title": "Real-time Insulin Check"}, {"body": "Identifies early-stage insulin resistance or elevated glucose before clinical symptoms develop.", "title": "Pre-Diabetes Screening"}]', '[{"desc": "Circulating sugar level in your bloodstream after fasting.", "name": "Fasting Blood Glucose", "strength": "100%"}]', NULL, 'Premium diagnostic pathology profile analyzing key clinical bio-markers.', '[{"a": "You must fast for at least 8 to 10 hours overnight. Do not fast for more than 12 hours as it can artificially skew results.", "q": "How long should I fast before the fasting sugar test?"}, {"a": "No. Only plain water is permitted during the fasting hours.", "q": "Can I drink tea or coffee during the fast?"}]');


--
-- TOC entry 5169 (class 0 OID 60459)
-- Dependencies: 218
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.users VALUES (1, 'Demo User', 'test@test.com', '9876543210', 'test', 'user', true, NULL, '2026-05-25 21:24:44.451072');
INSERT INTO public.users VALUES (2, 'System Admin', 'admin@choosemylab.com', '0000000000', 'admin123', 'admin', true, NULL, '2026-05-25 21:24:44.454452');
INSERT INTO public.users VALUES (80, 'System Admin', 'admin@pathlab.com', '0000000000', 'admin123', 'admin', true, NULL, '2026-05-28 16:07:39.966785');


--
-- TOC entry 5237 (class 0 OID 0)
-- Dependencies: 227
-- Name: bookings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.bookings_id_seq', 1, false);


--
-- TOC entry 5238 (class 0 OID 0)
-- Dependencies: 237
-- Name: categories_metadata_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.categories_metadata_id_seq', 48, true);


--
-- TOC entry 5239 (class 0 OID 0)
-- Dependencies: 257
-- Name: category_previews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.category_previews_id_seq', 34, true);


--
-- TOC entry 5240 (class 0 OID 0)
-- Dependencies: 223
-- Name: lab_branches_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.lab_branches_id_seq', 83, true);


--
-- TOC entry 5241 (class 0 OID 0)
-- Dependencies: 235
-- Name: lab_package_branches_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.lab_package_branches_id_seq', 11046, true);


--
-- TOC entry 5242 (class 0 OID 0)
-- Dependencies: 239
-- Name: lab_profiles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.lab_profiles_id_seq', 186, true);


--
-- TOC entry 5243 (class 0 OID 0)
-- Dependencies: 225
-- Name: lab_test_branches_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.lab_test_branches_id_seq', 1109, true);


--
-- TOC entry 5244 (class 0 OID 0)
-- Dependencies: 221
-- Name: labs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.labs_id_seq', 31, true);


--
-- TOC entry 5245 (class 0 OID 0)
-- Dependencies: 233
-- Name: package_tests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.package_tests_id_seq', 1836, true);


--
-- TOC entry 5246 (class 0 OID 0)
-- Dependencies: 231
-- Name: packages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.packages_id_seq', 240, true);


--
-- TOC entry 5247 (class 0 OID 0)
-- Dependencies: 241
-- Name: packages_landing_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.packages_landing_categories_id_seq', 42, true);


--
-- TOC entry 5248 (class 0 OID 0)
-- Dependencies: 245
-- Name: packages_landing_faqs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.packages_landing_faqs_id_seq', 18, true);


--
-- TOC entry 5249 (class 0 OID 0)
-- Dependencies: 247
-- Name: packages_landing_partners_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.packages_landing_partners_id_seq', 30, true);


--
-- TOC entry 5250 (class 0 OID 0)
-- Dependencies: 243
-- Name: packages_landing_popular_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.packages_landing_popular_id_seq', 24, true);


--
-- TOC entry 5251 (class 0 OID 0)
-- Dependencies: 255
-- Name: packages_listing_faqs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.packages_listing_faqs_id_seq', 126, true);


--
-- TOC entry 5252 (class 0 OID 0)
-- Dependencies: 253
-- Name: packages_listing_guides_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.packages_listing_guides_id_seq', 126, true);


--
-- TOC entry 5253 (class 0 OID 0)
-- Dependencies: 249
-- Name: packages_listing_hero_metadata_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.packages_listing_hero_metadata_id_seq', 42, true);


--
-- TOC entry 5254 (class 0 OID 0)
-- Dependencies: 251
-- Name: packages_listing_tiers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.packages_listing_tiers_id_seq', 168, true);


--
-- TOC entry 5255 (class 0 OID 0)
-- Dependencies: 229
-- Name: reports_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.reports_id_seq', 1, false);


--
-- TOC entry 5256 (class 0 OID 0)
-- Dependencies: 219
-- Name: tests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tests_id_seq', 173, true);


--
-- TOC entry 5257 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 90, true);


--
-- TOC entry 4945 (class 2606 OID 60549)
-- Name: bookings bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_pkey PRIMARY KEY (id);


--
-- TOC entry 4964 (class 2606 OID 76879)
-- Name: categories_metadata categories_metadata_category_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories_metadata
    ADD CONSTRAINT categories_metadata_category_name_key UNIQUE (category_name);


--
-- TOC entry 4966 (class 2606 OID 76877)
-- Name: categories_metadata categories_metadata_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories_metadata
    ADD CONSTRAINT categories_metadata_pkey PRIMARY KEY (id);


--
-- TOC entry 5004 (class 2606 OID 77136)
-- Name: category_previews category_previews_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.category_previews
    ADD CONSTRAINT category_previews_pkey PRIMARY KEY (id);


--
-- TOC entry 4936 (class 2606 OID 60508)
-- Name: lab_branches lab_branches_lab_id_branch_name_city_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lab_branches
    ADD CONSTRAINT lab_branches_lab_id_branch_name_city_key UNIQUE (lab_id, branch_name, city);


--
-- TOC entry 4938 (class 2606 OID 60506)
-- Name: lab_branches lab_branches_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lab_branches
    ADD CONSTRAINT lab_branches_pkey PRIMARY KEY (id);


--
-- TOC entry 4960 (class 2606 OID 60635)
-- Name: lab_package_branches lab_package_branches_lab_branch_id_package_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lab_package_branches
    ADD CONSTRAINT lab_package_branches_lab_branch_id_package_id_key UNIQUE (lab_branch_id, package_id);


--
-- TOC entry 4962 (class 2606 OID 60633)
-- Name: lab_package_branches lab_package_branches_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lab_package_branches
    ADD CONSTRAINT lab_package_branches_pkey PRIMARY KEY (id);


--
-- TOC entry 4968 (class 2606 OID 76902)
-- Name: lab_profiles lab_profiles_lab_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lab_profiles
    ADD CONSTRAINT lab_profiles_lab_id_key UNIQUE (lab_id);


--
-- TOC entry 4970 (class 2606 OID 76900)
-- Name: lab_profiles lab_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lab_profiles
    ADD CONSTRAINT lab_profiles_pkey PRIMARY KEY (id);


--
-- TOC entry 4941 (class 2606 OID 60524)
-- Name: lab_test_branches lab_test_branches_lab_branch_id_test_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lab_test_branches
    ADD CONSTRAINT lab_test_branches_lab_branch_id_test_id_key UNIQUE (lab_branch_id, test_id);


--
-- TOC entry 4943 (class 2606 OID 60522)
-- Name: lab_test_branches lab_test_branches_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lab_test_branches
    ADD CONSTRAINT lab_test_branches_pkey PRIMARY KEY (id);


--
-- TOC entry 4930 (class 2606 OID 60494)
-- Name: labs labs_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.labs
    ADD CONSTRAINT labs_name_key UNIQUE (name);


--
-- TOC entry 4932 (class 2606 OID 60492)
-- Name: labs labs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.labs
    ADD CONSTRAINT labs_pkey PRIMARY KEY (id);


--
-- TOC entry 4954 (class 2606 OID 60611)
-- Name: package_tests package_tests_package_id_test_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.package_tests
    ADD CONSTRAINT package_tests_package_id_test_id_key UNIQUE (package_id, test_id);


--
-- TOC entry 4956 (class 2606 OID 60609)
-- Name: package_tests package_tests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.package_tests
    ADD CONSTRAINT package_tests_pkey PRIMARY KEY (id);


--
-- TOC entry 4972 (class 2606 OID 76918)
-- Name: packages_landing_categories packages_landing_categories_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.packages_landing_categories
    ADD CONSTRAINT packages_landing_categories_name_key UNIQUE (name);


--
-- TOC entry 4974 (class 2606 OID 76916)
-- Name: packages_landing_categories packages_landing_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.packages_landing_categories
    ADD CONSTRAINT packages_landing_categories_pkey PRIMARY KEY (id);


--
-- TOC entry 4980 (class 2606 OID 76948)
-- Name: packages_landing_faqs packages_landing_faqs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.packages_landing_faqs
    ADD CONSTRAINT packages_landing_faqs_pkey PRIMARY KEY (id);


--
-- TOC entry 4982 (class 2606 OID 76950)
-- Name: packages_landing_faqs packages_landing_faqs_question_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.packages_landing_faqs
    ADD CONSTRAINT packages_landing_faqs_question_key UNIQUE (question);


--
-- TOC entry 4984 (class 2606 OID 76961)
-- Name: packages_landing_partners packages_landing_partners_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.packages_landing_partners
    ADD CONSTRAINT packages_landing_partners_name_key UNIQUE (name);


--
-- TOC entry 4986 (class 2606 OID 76959)
-- Name: packages_landing_partners packages_landing_partners_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.packages_landing_partners
    ADD CONSTRAINT packages_landing_partners_pkey PRIMARY KEY (id);


--
-- TOC entry 4976 (class 2606 OID 76932)
-- Name: packages_landing_popular packages_landing_popular_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.packages_landing_popular
    ADD CONSTRAINT packages_landing_popular_name_key UNIQUE (name);


--
-- TOC entry 4978 (class 2606 OID 76930)
-- Name: packages_landing_popular packages_landing_popular_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.packages_landing_popular
    ADD CONSTRAINT packages_landing_popular_pkey PRIMARY KEY (id);


--
-- TOC entry 5000 (class 2606 OID 77010)
-- Name: packages_listing_faqs packages_listing_faqs_category_question_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.packages_listing_faqs
    ADD CONSTRAINT packages_listing_faqs_category_question_key UNIQUE (category, question);


--
-- TOC entry 5002 (class 2606 OID 77008)
-- Name: packages_listing_faqs packages_listing_faqs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.packages_listing_faqs
    ADD CONSTRAINT packages_listing_faqs_pkey PRIMARY KEY (id);


--
-- TOC entry 4996 (class 2606 OID 76998)
-- Name: packages_listing_guides packages_listing_guides_category_title_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.packages_listing_guides
    ADD CONSTRAINT packages_listing_guides_category_title_key UNIQUE (category, title);


--
-- TOC entry 4998 (class 2606 OID 76996)
-- Name: packages_listing_guides packages_listing_guides_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.packages_listing_guides
    ADD CONSTRAINT packages_listing_guides_pkey PRIMARY KEY (id);


--
-- TOC entry 4988 (class 2606 OID 76974)
-- Name: packages_listing_hero_metadata packages_listing_hero_metadata_category_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.packages_listing_hero_metadata
    ADD CONSTRAINT packages_listing_hero_metadata_category_key UNIQUE (category);


--
-- TOC entry 4990 (class 2606 OID 76972)
-- Name: packages_listing_hero_metadata packages_listing_hero_metadata_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.packages_listing_hero_metadata
    ADD CONSTRAINT packages_listing_hero_metadata_pkey PRIMARY KEY (id);


--
-- TOC entry 4992 (class 2606 OID 76986)
-- Name: packages_listing_tiers packages_listing_tiers_category_tier_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.packages_listing_tiers
    ADD CONSTRAINT packages_listing_tiers_category_tier_name_key UNIQUE (category, tier_name);


--
-- TOC entry 4994 (class 2606 OID 76984)
-- Name: packages_listing_tiers packages_listing_tiers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.packages_listing_tiers
    ADD CONSTRAINT packages_listing_tiers_pkey PRIMARY KEY (id);


--
-- TOC entry 4950 (class 2606 OID 60602)
-- Name: packages packages_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.packages
    ADD CONSTRAINT packages_name_key UNIQUE (name);


--
-- TOC entry 4952 (class 2606 OID 60600)
-- Name: packages packages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.packages
    ADD CONSTRAINT packages_pkey PRIMARY KEY (id);


--
-- TOC entry 4947 (class 2606 OID 60578)
-- Name: reports reports_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_pkey PRIMARY KEY (id);


--
-- TOC entry 4928 (class 2606 OID 60479)
-- Name: tests tests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tests
    ADD CONSTRAINT tests_pkey PRIMARY KEY (id);


--
-- TOC entry 4922 (class 2606 OID 60469)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4924 (class 2606 OID 60467)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4933 (class 1259 OID 60567)
-- Name: idx_lab_branches_city; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_lab_branches_city ON public.lab_branches USING btree (lower((city)::text));


--
-- TOC entry 4934 (class 1259 OID 60568)
-- Name: idx_lab_branches_coordinates; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_lab_branches_coordinates ON public.lab_branches USING btree (latitude, longitude);


--
-- TOC entry 4957 (class 1259 OID 60652)
-- Name: idx_lab_package_branches_package; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_lab_package_branches_package ON public.lab_package_branches USING btree (package_id);


--
-- TOC entry 4958 (class 1259 OID 60653)
-- Name: idx_lab_package_branches_price; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_lab_package_branches_price ON public.lab_package_branches USING btree (price);


--
-- TOC entry 4939 (class 1259 OID 60569)
-- Name: idx_lab_test_branches_test; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_lab_test_branches_test ON public.lab_test_branches USING btree (test_id);


--
-- TOC entry 4948 (class 1259 OID 60651)
-- Name: idx_packages_name; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_packages_name ON public.packages USING btree (name);


--
-- TOC entry 4925 (class 1259 OID 60565)
-- Name: idx_tests_coordinates; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_tests_coordinates ON public.tests USING btree (latitude, longitude);


--
-- TOC entry 4926 (class 1259 OID 60566)
-- Name: idx_tests_name_coordinates; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_tests_name_coordinates ON public.tests USING btree (name, latitude, longitude);


--
-- TOC entry 5009 (class 2606 OID 60560)
-- Name: bookings bookings_lab_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_lab_branch_id_fkey FOREIGN KEY (lab_branch_id) REFERENCES public.lab_branches(id);


--
-- TOC entry 5010 (class 2606 OID 60555)
-- Name: bookings bookings_test_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_test_id_fkey FOREIGN KEY (test_id) REFERENCES public.tests(id);


--
-- TOC entry 5011 (class 2606 OID 60550)
-- Name: bookings bookings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 5021 (class 2606 OID 77142)
-- Name: category_previews category_previews_package_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.category_previews
    ADD CONSTRAINT category_previews_package_id_fkey FOREIGN KEY (package_id) REFERENCES public.packages(id) ON DELETE CASCADE;


--
-- TOC entry 5022 (class 2606 OID 77137)
-- Name: category_previews category_previews_test_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.category_previews
    ADD CONSTRAINT category_previews_test_id_fkey FOREIGN KEY (test_id) REFERENCES public.tests(id) ON DELETE CASCADE;


--
-- TOC entry 5005 (class 2606 OID 60509)
-- Name: lab_branches lab_branches_lab_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lab_branches
    ADD CONSTRAINT lab_branches_lab_id_fkey FOREIGN KEY (lab_id) REFERENCES public.labs(id) ON DELETE CASCADE;


--
-- TOC entry 5016 (class 2606 OID 60641)
-- Name: lab_package_branches lab_package_branches_lab_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lab_package_branches
    ADD CONSTRAINT lab_package_branches_lab_branch_id_fkey FOREIGN KEY (lab_branch_id) REFERENCES public.lab_branches(id) ON DELETE CASCADE;


--
-- TOC entry 5017 (class 2606 OID 60636)
-- Name: lab_package_branches lab_package_branches_lab_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lab_package_branches
    ADD CONSTRAINT lab_package_branches_lab_id_fkey FOREIGN KEY (lab_id) REFERENCES public.labs(id) ON DELETE CASCADE;


--
-- TOC entry 5018 (class 2606 OID 60646)
-- Name: lab_package_branches lab_package_branches_package_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lab_package_branches
    ADD CONSTRAINT lab_package_branches_package_id_fkey FOREIGN KEY (package_id) REFERENCES public.packages(id) ON DELETE CASCADE;


--
-- TOC entry 5019 (class 2606 OID 76903)
-- Name: lab_profiles lab_profiles_lab_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lab_profiles
    ADD CONSTRAINT lab_profiles_lab_id_fkey FOREIGN KEY (lab_id) REFERENCES public.labs(id) ON DELETE CASCADE;


--
-- TOC entry 5006 (class 2606 OID 60530)
-- Name: lab_test_branches lab_test_branches_lab_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lab_test_branches
    ADD CONSTRAINT lab_test_branches_lab_branch_id_fkey FOREIGN KEY (lab_branch_id) REFERENCES public.lab_branches(id) ON DELETE CASCADE;


--
-- TOC entry 5007 (class 2606 OID 60525)
-- Name: lab_test_branches lab_test_branches_lab_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lab_test_branches
    ADD CONSTRAINT lab_test_branches_lab_id_fkey FOREIGN KEY (lab_id) REFERENCES public.labs(id) ON DELETE CASCADE;


--
-- TOC entry 5008 (class 2606 OID 60535)
-- Name: lab_test_branches lab_test_branches_test_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lab_test_branches
    ADD CONSTRAINT lab_test_branches_test_id_fkey FOREIGN KEY (test_id) REFERENCES public.tests(id) ON DELETE CASCADE;


--
-- TOC entry 5014 (class 2606 OID 60612)
-- Name: package_tests package_tests_package_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.package_tests
    ADD CONSTRAINT package_tests_package_id_fkey FOREIGN KEY (package_id) REFERENCES public.packages(id) ON DELETE CASCADE;


--
-- TOC entry 5015 (class 2606 OID 60617)
-- Name: package_tests package_tests_test_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.package_tests
    ADD CONSTRAINT package_tests_test_id_fkey FOREIGN KEY (test_id) REFERENCES public.tests(id) ON DELETE CASCADE;


--
-- TOC entry 5020 (class 2606 OID 76933)
-- Name: packages_landing_popular packages_landing_popular_package_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.packages_landing_popular
    ADD CONSTRAINT packages_landing_popular_package_id_fkey FOREIGN KEY (package_id) REFERENCES public.packages(id) ON DELETE SET NULL;


--
-- TOC entry 5012 (class 2606 OID 60584)
-- Name: reports reports_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id);


--
-- TOC entry 5013 (class 2606 OID 60579)
-- Name: reports reports_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


-- Completed on 2026-05-28 17:24:10

--
-- PostgreSQL database dump complete
--

