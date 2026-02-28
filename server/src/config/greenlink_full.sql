--
-- PostgreSQL database dump
--

\restrict OiCwhv4jSUAkv3NBeljchmyuXgkqZonhYbDf4jAfkRef7dMZv6jTxegnbaXpJG5

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

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
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: growth_stage; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.growth_stage AS ENUM (
    'Sprout',
    'Seedling',
    'Vegetating',
    'Budding',
    'Flowering',
    'Fruiting',
    'Ready To Harvest'
);


ALTER TYPE public.growth_stage OWNER TO postgres;

--
-- Name: harvest_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.harvest_status_enum AS ENUM (
    'Not Ready',
    'Due Now',
    'Past Due'
);


ALTER TYPE public.harvest_status_enum OWNER TO postgres;

--
-- Name: status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.status AS ENUM (
    'Sprout',
    'Seedling',
    'Vegetating',
    'Budding',
    'Flowering',
    'Fruiting',
    'ReadyToHarvest'
);


ALTER TYPE public.status OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: device_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.device_tokens (
    id integer NOT NULL,
    user_id integer,
    push_token text NOT NULL,
    device_type text NOT NULL,
    device_info jsonb,
    last_active timestamp without time zone DEFAULT now(),
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.device_tokens OWNER TO postgres;

--
-- Name: device_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.device_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.device_tokens_id_seq OWNER TO postgres;

--
-- Name: device_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.device_tokens_id_seq OWNED BY public.device_tokens.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    notification_id integer NOT NULL,
    type character varying(50) NOT NULL,
    message text NOT NULL,
    related_sensor integer,
    status character varying(10) DEFAULT 'NORMAL'::character varying,
    is_read boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now(),
    batch_id integer
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- Name: notifications_notification_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notifications_notification_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notifications_notification_id_seq OWNER TO postgres;

--
-- Name: notifications_notification_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notifications_notification_id_seq OWNED BY public.notifications.notification_id;


--
-- Name: plant_batch_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.plant_batch_history (
    history_id integer NOT NULL,
    batch_id integer,
    tray_id integer,
    plant_name character varying(100) NOT NULL,
    date_recorded date NOT NULL,
    total_seedlings integer DEFAULT 0,
    dead_seedlings integer DEFAULT 0,
    replanted_seedlings integer DEFAULT 0,
    fully_grown_seedlings integer DEFAULT 0,
    growth_stage character varying(50) DEFAULT 'Seedling'::character varying,
    expected_harvest_days integer NOT NULL,
    notes text,
    created_at timestamp without time zone DEFAULT now(),
    batch_number integer,
    history_number integer
);


ALTER TABLE public.plant_batch_history OWNER TO postgres;

--
-- Name: plant_batch_history_history_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.plant_batch_history_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.plant_batch_history_history_id_seq OWNER TO postgres;

--
-- Name: plant_batch_history_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.plant_batch_history_history_id_seq OWNED BY public.plant_batch_history.history_id;


--
-- Name: plant_batches; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.plant_batches (
    batch_id integer NOT NULL,
    tray_id integer NOT NULL,
    plant_name character varying(100) NOT NULL,
    total_seedlings integer,
    dead_seedlings integer,
    replanted_seedlings integer,
    fully_grown_seedlings integer,
    growth_stage text DEFAULT 'Seedling'::character varying,
    date_planted date NOT NULL,
    expected_harvest_days integer NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    batch_number integer NOT NULL,
    harvest_status public.harvest_status_enum DEFAULT 'Not Ready'::public.harvest_status_enum NOT NULL,
    status text DEFAULT 'Growing'::text
);


ALTER TABLE public.plant_batches OWNER TO postgres;

--
-- Name: plant_batches_batch_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.plant_batches_batch_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.plant_batches_batch_id_seq OWNER TO postgres;

--
-- Name: plant_batches_batch_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.plant_batches_batch_id_seq OWNED BY public.plant_batches.batch_id;


--
-- Name: plant_groups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.plant_groups (
    plant_group_id integer NOT NULL,
    group_name character varying(100) NOT NULL,
    moisture_min integer NOT NULL,
    moisture_max integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.plant_groups OWNER TO postgres;

--
-- Name: plant_groups_plant_group_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.plant_groups_plant_group_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.plant_groups_plant_group_id_seq OWNER TO postgres;

--
-- Name: plant_groups_plant_group_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.plant_groups_plant_group_id_seq OWNED BY public.plant_groups.plant_group_id;


--
-- Name: plants; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.plants (
    plant_id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    image_url character varying(255),
    reference_link character varying(255),
    moisture_min integer NOT NULL,
    moisture_max integer NOT NULL,
    group_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT plants_check CHECK ((moisture_min <= moisture_max))
);


ALTER TABLE public.plants OWNER TO postgres;

--
-- Name: plants_plant_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.plants_plant_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.plants_plant_id_seq OWNER TO postgres;

--
-- Name: plants_plant_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.plants_plant_id_seq OWNED BY public.plants.plant_id;


--
-- Name: sensor_readings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sensor_readings (
    reading_id integer NOT NULL,
    sensor_id integer NOT NULL,
    value numeric(6,2) NOT NULL,
    recorded_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.sensor_readings OWNER TO postgres;

--
-- Name: sensor_readings_reading_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sensor_readings_reading_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sensor_readings_reading_id_seq OWNER TO postgres;

--
-- Name: sensor_readings_reading_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sensor_readings_reading_id_seq OWNED BY public.sensor_readings.reading_id;


--
-- Name: sensors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sensors (
    sensor_id integer NOT NULL,
    tray_id integer,
    sensor_type character varying(100),
    status character varying(40),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.sensors OWNER TO postgres;

--
-- Name: sensors_sensor_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sensors_sensor_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sensors_sensor_id_seq OWNER TO postgres;

--
-- Name: sensors_sensor_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sensors_sensor_id_seq OWNED BY public.sensors.sensor_id;


--
-- Name: tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tokens (
    token_id integer NOT NULL,
    user_id integer NOT NULL,
    refresh_token text NOT NULL,
    device jsonb NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    device_id uuid DEFAULT gen_random_uuid()
);


ALTER TABLE public.tokens OWNER TO postgres;

--
-- Name: tokens_token_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tokens_token_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tokens_token_id_seq OWNER TO postgres;

--
-- Name: tokens_token_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tokens_token_id_seq OWNED BY public.tokens.token_id;


--
-- Name: tray_groups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tray_groups (
    tray_group_id integer NOT NULL,
    tray_group_name character varying(100) NOT NULL,
    group_number integer NOT NULL,
    min_moisture numeric NOT NULL,
    max_moisture numeric NOT NULL,
    is_watering boolean DEFAULT false,
    location character varying(100),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.tray_groups OWNER TO postgres;

--
-- Name: tray_groups_tray_group_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tray_groups_tray_group_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tray_groups_tray_group_id_seq OWNER TO postgres;

--
-- Name: tray_groups_tray_group_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tray_groups_tray_group_id_seq OWNED BY public.tray_groups.tray_group_id;


--
-- Name: trays; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trays (
    tray_id integer NOT NULL,
    tray_group_id integer,
    tray_number integer NOT NULL,
    plant character varying(100) NOT NULL,
    status character varying(50) DEFAULT 'Active'::character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.trays OWNER TO postgres;

--
-- Name: trays_tray_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.trays_tray_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.trays_tray_id_seq OWNER TO postgres;

--
-- Name: trays_tray_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.trays_tray_id_seq OWNED BY public.trays.tray_id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    username character varying(150) NOT NULL,
    fullname character varying(150) NOT NULL,
    email character varying(200),
    phone_number character varying(30),
    password_hash text,
    role character varying(20) NOT NULL,
    status character varying(20),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    first_time_login boolean DEFAULT true,
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['owner'::character varying, 'admin'::character varying, 'viewer'::character varying])::text[]))),
    CONSTRAINT users_status_check CHECK (((status)::text = ANY ((ARRAY['active'::character varying, 'inactive'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.user_id;


--
-- Name: valves; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.valves (
    valve_id integer NOT NULL,
    valve_name character varying(20),
    mode character varying(20) DEFAULT 'AUTO'::character varying
);


ALTER TABLE public.valves OWNER TO postgres;

--
-- Name: valves_valve_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.valves_valve_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.valves_valve_id_seq OWNER TO postgres;

--
-- Name: valves_valve_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.valves_valve_id_seq OWNED BY public.valves.valve_id;


--
-- Name: device_tokens id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.device_tokens ALTER COLUMN id SET DEFAULT nextval('public.device_tokens_id_seq'::regclass);


--
-- Name: notifications notification_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications ALTER COLUMN notification_id SET DEFAULT nextval('public.notifications_notification_id_seq'::regclass);


--
-- Name: plant_batch_history history_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plant_batch_history ALTER COLUMN history_id SET DEFAULT nextval('public.plant_batch_history_history_id_seq'::regclass);


--
-- Name: plant_batches batch_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plant_batches ALTER COLUMN batch_id SET DEFAULT nextval('public.plant_batches_batch_id_seq'::regclass);


--
-- Name: plant_groups plant_group_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plant_groups ALTER COLUMN plant_group_id SET DEFAULT nextval('public.plant_groups_plant_group_id_seq'::regclass);


--
-- Name: plants plant_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plants ALTER COLUMN plant_id SET DEFAULT nextval('public.plants_plant_id_seq'::regclass);


--
-- Name: sensor_readings reading_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sensor_readings ALTER COLUMN reading_id SET DEFAULT nextval('public.sensor_readings_reading_id_seq'::regclass);


--
-- Name: sensors sensor_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sensors ALTER COLUMN sensor_id SET DEFAULT nextval('public.sensors_sensor_id_seq'::regclass);


--
-- Name: tokens token_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tokens ALTER COLUMN token_id SET DEFAULT nextval('public.tokens_token_id_seq'::regclass);


--
-- Name: tray_groups tray_group_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tray_groups ALTER COLUMN tray_group_id SET DEFAULT nextval('public.tray_groups_tray_group_id_seq'::regclass);


--
-- Name: trays tray_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trays ALTER COLUMN tray_id SET DEFAULT nextval('public.trays_tray_id_seq'::regclass);


--
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: valves valve_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.valves ALTER COLUMN valve_id SET DEFAULT nextval('public.valves_valve_id_seq'::regclass);


--
-- Data for Name: device_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.device_tokens (id, user_id, push_token, device_type, device_info, last_active, created_at) FROM stdin;
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (notification_id, type, message, related_sensor, status, is_read, created_at, batch_id) FROM stdin;
\.


--
-- Data for Name: plant_batch_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.plant_batch_history (history_id, batch_id, tray_id, plant_name, date_recorded, total_seedlings, dead_seedlings, replanted_seedlings, fully_grown_seedlings, growth_stage, expected_harvest_days, notes, created_at, batch_number, history_number) FROM stdin;
97	\N	14	Bokchoy	2026-02-26	30	5	5	5	Ready To Harvest	2	\N	2026-02-26 00:39:07.929215	1	1
98	\N	16	Mustasa	2026-02-26	60	2	50	8	Ready To Harvest	2	\N	2026-02-26 00:39:09.018835	1	1
99	\N	15	Pechay	2026-02-26	50	2	7	41	Ready To Harvest	2	\N	2026-02-26 00:39:10.889995	1	1
100	\N	14	Bokchoy	2026-02-26	24	1	2	21	Ready To Harvest	2	\N	2026-02-26 00:39:46.547654	1	2
\.


--
-- Data for Name: plant_batches; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.plant_batches (batch_id, tray_id, plant_name, total_seedlings, dead_seedlings, replanted_seedlings, fully_grown_seedlings, growth_stage, date_planted, expected_harvest_days, created_at, batch_number, harvest_status, status) FROM stdin;
194	14	Bokchoy	30	0	0	0	Sprout	2026-02-26	2	2026-02-26 01:44:14.06265	1	Not Ready	Growing
\.


--
-- Data for Name: plant_groups; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.plant_groups (plant_group_id, group_name, moisture_min, moisture_max, created_at) FROM stdin;
1	Bokchoy	50	70	2026-02-23 18:38:36.176243
2	Pechay	50	70	2026-02-23 18:38:50.503533
3	Mustasa	60	90	2026-02-23 18:38:58.285485
\.


--
-- Data for Name: plants; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.plants (plant_id, name, description, image_url, reference_link, moisture_min, moisture_max, group_id, created_at) FROM stdin;
6	dadadadaadaa	\N	\N	\N	50	60	\N	2026-02-23 22:38:13.703954
7	dada	\N	\N	\N	50	70	\N	2026-02-23 22:38:27.460151
8	dadaaa	\N	\N	\N	50	70	\N	2026-02-23 22:40:28.072066
33	Letuce	\N	\N	https://hortamericas.com/blog/news/monitoring-is-crucial-for-growing-lettuce-and-leafy-greens-year-round/?srsltid=AfmBOoquWofZuVW0EcRyNzuqzpRoVK_u0-u5Zy2h6FjU11Yz5dxPNMOt	50	70	1	2026-02-25 20:51:09.537604
35	Romaine	\N	\N	https://www.umass.edu/agriculture-food-environment/vegetable/fact-sheets/irrigating-vegetable-crops	50	70	1	2026-02-25 21:32:58.423406
36	Romaine	\N	\N	https://www.umass.edu/agriculture-food-environment/vegetable/fact-sheets/irrigating-vegetable-crops	50	70	2	2026-02-25 21:33:31.949612
5	Letuce	\N	\N	https://hortamericas.com/blog/news/monitoring-is-crucial-for-growing-lettuce-and-leafy-greens-year-round/?srsltid=AfmBOoquWofZuVW0EcRyNzuqzpRoVK_u0-u5Zy2h6FjU11Yz5dxPNMOt	55	70	2	2026-02-23 21:30:13.859498
3	Mustasa	\N	\N	https://iopscience.iop.org/article/10.1088/1755- 1315/1454/1/012006/pdf#:~:text=The%20optimal%20moisture%20level%20for,and%2037% 20cm %5B3%5D. https://www.scribd.com/document/828630843/Mustard	55	70	3	2026-02-23 20:36:09.824297
37	Bokchoy	\N	\N	<a   href={plant.reference_link}   target="_blank"   rel="noopener noreferrer"   className="cursor-pointer h-24 bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center text-3xl" >   🌿 </a>	50	70	1	2026-02-26 16:32:11.646178
\.


--
-- Data for Name: sensor_readings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sensor_readings (reading_id, sensor_id, value, recorded_at) FROM stdin;
\.


--
-- Data for Name: sensors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sensors (sensor_id, tray_id, sensor_type, status, created_at, updated_at) FROM stdin;
5	14	moisture	Active	2026-02-11 17:26:42.375908	2026-02-11 17:26:42.375908
6	15	moisture	Active	2026-02-11 17:26:48.488599	2026-02-11 17:26:48.488599
7	16	moisture	Active	2026-02-11 17:26:51.046707	2026-02-11 17:26:51.046707
8	\N	ultra_sonic	Active	2026-02-11 17:29:59.830148	2026-02-11 17:29:59.830148
\.


--
-- Data for Name: tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tokens (token_id, user_id, refresh_token, device, created_at, device_id) FROM stdin;
1580	162	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNjIsInVzZXJuYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImpodW5ndWlkZWZAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzcxOTQ5MTQwLCJleHAiOjE3NzcxMzMxNDB9.ZbHlYAd85HpDpzVin25PoACNGax1edB7-D-w9Z8EnaQ	{"os": "Windows", "model": "Unknown", "vendor": "PC/Desktop", "browser": "Chrome", "osVersion": "10", "browserVersion": "141.0.0.0"}	2026-02-25 00:05:40.629255	97179263-8184-444d-9700-e143655af033
1585	162	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNjIsInVzZXJuYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImpodW5ndWlkZWZAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzcxOTg0NTM2LCJleHAiOjE3NzcxNjg1MzZ9.yfinptaU3rl0P4oLnoA6fiQBOdPPqV7isT1o-bIYSLA	{"os": "Unknown", "model": "Unknown", "vendor": "PC/Desktop", "browser": "Unknown", "osVersion": "Unknown", "browserVersion": "Unknown"}	2026-02-25 09:55:36.68653	2e1a0f65-002d-44cc-a320-e3fc417df1b5
1590	162	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNjIsInVzZXJuYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImpodW5ndWlkZWZAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzcxOTk4MjgzLCJleHAiOjE3NzcxODIyODN9.4d8wT3j42-clF9hIFGz5-p57y4r6gohV5KPQ7bWDNco	{"os": "Windows", "model": "Unknown", "vendor": "PC/Desktop", "browser": "Chrome", "osVersion": "10", "browserVersion": "141.0.0.0"}	2026-02-25 13:44:43.671335	5a68d10e-8cb7-4ffa-aeb3-83cc669bffac
1601	162	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNjIsInVzZXJuYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImpodW5ndWlkZWZAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzcyMDE0MjE3LCJleHAiOjE3NzcxOTgyMTd9.h6Yy2DFQq3PhCmwKx0KkIP2tjoW_MCXM1uJrJoFV7FQ	{"os": "Unknown", "model": "Unknown", "vendor": "PC/Desktop", "browser": "Unknown", "osVersion": "Unknown", "browserVersion": "Unknown"}	2026-02-25 18:10:17.556762	bb858d8a-0e0c-427d-8700-6f5dc6c79afa
1606	162	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNjIsInVzZXJuYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImpodW5ndWlkZWZAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzcyMDIzMzMwLCJleHAiOjE3NzcyMDczMzB9.jq2y-RK9S42lJjMyaWDtJiM-PIhOLCNj7Z_oNi8LvnU	{"os": "Windows", "model": "Unknown", "vendor": "PC/Desktop", "browser": "Chrome", "osVersion": "10", "browserVersion": "141.0.0.0"}	2026-02-25 20:42:10.613266	12601cfc-a52a-4022-8483-02d99f80af61
1547	162	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNjIsInVzZXJuYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImpodW5ndWlkZWZAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzcxODQ5NTk5LCJleHAiOjE3NzcwMzM1OTl9.bPU979VFckWeHO521xXgU1xi_ziduW_qHlEQ1i7MvsQ	{"os": "Windows", "model": "Unknown", "vendor": "PC/Desktop", "browser": "Chrome", "osVersion": "10", "browserVersion": "141.0.0.0"}	2026-02-23 20:26:39.778484	1fe40072-1b5a-4238-a4f2-32a467495945
1611	162	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNjIsInVzZXJuYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImpodW5ndWlkZWZAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzcyMDMzNzU0LCJleHAiOjE3NzcyMTc3NTR9.RLzSI2LC6Z1pvcHj3cF6HYtDE04_t5-7cxydVzTpNzc	{"os": "Unknown", "model": "Unknown", "vendor": "PC/Desktop", "browser": "Unknown", "osVersion": "Unknown", "browserVersion": "Unknown"}	2026-02-25 23:35:54.992252	0971df2a-bff5-4712-ba5a-cc6554effb8e
1616	162	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNjIsInVzZXJuYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImpodW5ndWlkZWZAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzcyMDkzOTAzLCJleHAiOjE3NzcyNzc5MDN9.5uvfq8Jh8Zw9Mtjs79UcCEWcpaQvgR66eOFEgfZPw4A	{"os": "Windows", "model": "Unknown", "vendor": "PC/Desktop", "browser": "Chrome", "osVersion": "10", "browserVersion": "141.0.0.0"}	2026-02-26 16:18:23.037817	e35decdd-f9b5-4e0c-a7a2-0578a2df34b3
1581	162	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNjIsInVzZXJuYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImpodW5ndWlkZWZAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzcxOTUyNzA0LCJleHAiOjE3NzcxMzY3MDR9.GnkBhVd1wKklRoR8omWOqjHXtWYpM6x6vV3FBtqg9nA	{"os": "Windows", "model": "Unknown", "vendor": "PC/Desktop", "browser": "Chrome", "osVersion": "10", "browserVersion": "141.0.0.0"}	2026-02-25 01:05:04.452176	6c3cc606-e8d8-4212-a594-1bcda1ade7f1
1586	162	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNjIsInVzZXJuYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImpodW5ndWlkZWZAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzcxOTg1MDQ5LCJleHAiOjE3NzcxNjkwNDl9.vJXvHkEEzY5aOXn3ZYA7DDgkyZybjOC0_5uUNPL-PYg	{"os": "Unknown", "model": "Unknown", "vendor": "PC/Desktop", "browser": "Unknown", "osVersion": "Unknown", "browserVersion": "Unknown"}	2026-02-25 10:04:09.902657	189e9d59-80bd-44a4-803c-509e3bd9f302
1591	162	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNjIsInVzZXJuYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImpodW5ndWlkZWZAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzcyMDAyODUzLCJleHAiOjE3NzcxODY4NTN9.6LnO6e5LG3UnuznX2FLrHxH_3soOpZIMJo5MUYtM-8o	{"os": "Windows", "model": "Unknown", "vendor": "PC/Desktop", "browser": "Chrome", "osVersion": "10", "browserVersion": "141.0.0.0"}	2026-02-25 15:00:53.605139	08548f2e-b2c9-472e-8eb9-21d06fe5a2de
1602	162	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNjIsInVzZXJuYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImpodW5ndWlkZWZAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzcyMDE0NzI5LCJleHAiOjE3NzcxOTg3Mjl9.VHnB2kSmRR_9DLgB6w8nLh2VZnEdYfHnjEhwH6VFu7I	{"os": "Unknown", "model": "Unknown", "vendor": "PC/Desktop", "browser": "Unknown", "osVersion": "Unknown", "browserVersion": "Unknown"}	2026-02-25 18:18:49.913543	bcd18ec2-7837-4f3c-aa2c-f0965cf7303d
1607	162	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNjIsInVzZXJuYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImpodW5ndWlkZWZAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzcyMDIzMzk4LCJleHAiOjE3NzcyMDczOTh9.zg0l1cYlVCXnZVt2iVVZeJWeYT_7DAWhMvcUJh01LqU	{"os": "Unknown", "model": "Unknown", "vendor": "PC/Desktop", "browser": "Unknown", "osVersion": "Unknown", "browserVersion": "Unknown"}	2026-02-25 20:43:18.496447	f69ce477-36f5-460c-902a-0ec92ada8d38
1612	162	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNjIsInVzZXJuYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImpodW5ndWlkZWZAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzcyMDM0NDM1LCJleHAiOjE3NzcyMTg0MzV9._kqpV-ULV7BbHy5QvJxu_tL6A0sjhpd8Cw89tU3mgPs	{"os": "Unknown", "model": "Unknown", "vendor": "PC/Desktop", "browser": "Unknown", "osVersion": "Unknown", "browserVersion": "Unknown"}	2026-02-25 23:47:15.236347	73e9e482-59f7-48f2-8207-3642a8866e02
1548	162	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNjIsInVzZXJuYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImpodW5ndWlkZWZAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzcxODUxNzYzLCJleHAiOjE3NzcwMzU3NjN9.1Oz2Zt4FnLyIKdcx1UQmUZONA4jx9072fr1KfoQJSkY	{"os": "Windows", "model": "Unknown", "vendor": "PC/Desktop", "browser": "Chrome", "osVersion": "10", "browserVersion": "141.0.0.0"}	2026-02-23 21:02:43.818129	5f7c3639-ceb4-4a86-a391-b719a8b4a39d
1582	162	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNjIsInVzZXJuYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImpodW5ndWlkZWZAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzcxOTgyNzI2LCJleHAiOjE3NzcxNjY3MjZ9.iULFJX7xliPD8tY-CT5K59ehjP1C6_kbZS8_H5O-ueo	{"os": "Windows", "model": "Unknown", "vendor": "PC/Desktop", "browser": "Chrome", "osVersion": "10", "browserVersion": "141.0.0.0"}	2026-02-25 09:25:26.103452	78d76cde-3865-445a-bebe-e2add3ed97e9
1587	162	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNjIsInVzZXJuYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImpodW5ndWlkZWZAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzcxOTg1NTQ4LCJleHAiOjE3NzcxNjk1NDh9.GeX87nDR5T3QTpD5JrQHslDSy_J-4IIa29-LozqnZBg	{"os": "Windows", "model": "Unknown", "vendor": "PC/Desktop", "browser": "Chrome", "osVersion": "10", "browserVersion": "141.0.0.0"}	2026-02-25 10:12:28.704675	4b8c4559-a377-490b-ac97-74d5dd2783d6
1592	162	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNjIsInVzZXJuYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImpodW5ndWlkZWZAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzcyMDAzNjI2LCJleHAiOjE3NzcxODc2MjZ9.bwTIrWkuVLZbTfGQtjRuArGATI25tTjFaWfcTmzcemw	{"os": "Unknown", "model": "Unknown", "vendor": "PC/Desktop", "browser": "Unknown", "osVersion": "Unknown", "browserVersion": "Unknown"}	2026-02-25 15:13:46.788099	87fc476e-23c5-4890-9d54-429d8ac5ed9b
1603	162	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNjIsInVzZXJuYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImpodW5ndWlkZWZAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzcyMDE1MzUyLCJleHAiOjE3NzcxOTkzNTJ9.67kDrJzQ3ZQLhQ5mg8pEqRPNQ0aa0anmCCn4RbAPQyA	{"os": "Unknown", "model": "Unknown", "vendor": "PC/Desktop", "browser": "Unknown", "osVersion": "Unknown", "browserVersion": "Unknown"}	2026-02-25 18:29:12.401896	ee2b7cd2-e1a6-46b0-95ee-f40bd479735c
1608	162	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNjIsInVzZXJuYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImpodW5ndWlkZWZAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzcyMDI3ODg3LCJleHAiOjE3NzcyMTE4ODd9.SfE07HzVZ8oJUKaZMzrTEzoCRBFjlo2-inQXVkjUdBY	{"os": "Windows", "model": "Unknown", "vendor": "PC/Desktop", "browser": "Chrome", "osVersion": "10", "browserVersion": "141.0.0.0"}	2026-02-25 21:58:07.609592	06b36fcc-7d01-44e9-878d-f1676653143b
1549	162	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNjIsInVzZXJuYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImpodW5ndWlkZWZAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzcxODUxNzYzLCJleHAiOjE3NzcwMzU3NjN9.1Oz2Zt4FnLyIKdcx1UQmUZONA4jx9072fr1KfoQJSkY	{"os": "Windows", "model": "Unknown", "vendor": "PC/Desktop", "browser": "Chrome", "osVersion": "10", "browserVersion": "141.0.0.0"}	2026-02-23 21:02:43.832468	e6b4a495-55b5-406b-8aab-daf7eb304783
1502	162	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNjIsInVzZXJuYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImpodW5ndWlkZWZAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzcxNzcyODEyLCJleHAiOjE3NzY5NTY4MTJ9.B3rMqZX20QYd6rPN88-v2nTQrkNAl6Oka2osifFw1I0	{"os": "Unknown", "model": "Unknown", "vendor": "PC/Desktop", "browser": "Unknown", "osVersion": "Unknown", "browserVersion": "Unknown"}	2026-02-22 23:06:52.927781	5efcae74-a073-4fba-9665-86e3f9f4dcdd
1550	162	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNjIsInVzZXJuYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImpodW5ndWlkZWZAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzcxODUxNzYzLCJleHAiOjE3NzcwMzU3NjN9.1Oz2Zt4FnLyIKdcx1UQmUZONA4jx9072fr1KfoQJSkY	{"os": "Windows", "model": "Unknown", "vendor": "PC/Desktop", "browser": "Chrome", "osVersion": "10", "browserVersion": "141.0.0.0"}	2026-02-23 21:02:43.85345	13979047-7401-4941-bc3b-7ad4c0ea0a83
1551	162	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNjIsInVzZXJuYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImpodW5ndWlkZWZAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzcxODUxNzYzLCJleHAiOjE3NzcwMzU3NjN9.1Oz2Zt4FnLyIKdcx1UQmUZONA4jx9072fr1KfoQJSkY	{"os": "Windows", "model": "Unknown", "vendor": "PC/Desktop", "browser": "Chrome", "osVersion": "10", "browserVersion": "141.0.0.0"}	2026-02-23 21:02:43.864319	5bc60df4-b88c-4e9c-a200-dfde37d2ed75
1552	162	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNjIsInVzZXJuYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImpodW5ndWlkZWZAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzcxODUxNzYzLCJleHAiOjE3NzcwMzU3NjN9.1Oz2Zt4FnLyIKdcx1UQmUZONA4jx9072fr1KfoQJSkY	{"os": "Windows", "model": "Unknown", "vendor": "PC/Desktop", "browser": "Chrome", "osVersion": "10", "browserVersion": "141.0.0.0"}	2026-02-23 21:02:43.949807	437909ed-07d4-422b-9ad3-64825933f6d2
1553	162	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNjIsInVzZXJuYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImpodW5ndWlkZWZAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzcxODUxNzYzLCJleHAiOjE3NzcwMzU3NjN9.1Oz2Zt4FnLyIKdcx1UQmUZONA4jx9072fr1KfoQJSkY	{"os": "Windows", "model": "Unknown", "vendor": "PC/Desktop", "browser": "Chrome", "osVersion": "10", "browserVersion": "141.0.0.0"}	2026-02-23 21:02:43.974691	d0274124-8e13-461c-8328-9888a46558f2
1554	162	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNjIsInVzZXJuYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImpodW5ndWlkZWZAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzcxODUxNzY0LCJleHAiOjE3NzcwMzU3NjR9.zB5s_5-tRTvrTTdYbeBCjD9QwhySJNAHe0_9BVSdV-s	{"os": "Windows", "model": "Unknown", "vendor": "PC/Desktop", "browser": "Chrome", "osVersion": "10", "browserVersion": "141.0.0.0"}	2026-02-23 21:02:44.113112	e4abfbda-ab7e-45f4-a012-c673b9f75324
1613	162	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNjIsInVzZXJuYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImpodW5ndWlkZWZAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzcyMDM1Njc0LCJleHAiOjE3NzcyMTk2NzR9.G7hbT5SrlEJ8gRgFAsyCeAuDx3g8ofOlOP9Y3DgHGFc	{"os": "Windows", "model": "Unknown", "vendor": "PC/Desktop", "browser": "Chrome", "osVersion": "10", "browserVersion": "141.0.0.0"}	2026-02-26 00:07:54.187837	1c02154f-523a-48c6-86ff-3b1f6606b55c
1583	162	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNjIsInVzZXJuYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImpodW5ndWlkZWZAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzcxOTgzNzUwLCJleHAiOjE3NzcxNjc3NTB9.aQ6ma2D8Px8gLNAKIKtAH5jN11UZqnRPeXlNjiLbuCw	{"os": "Unknown", "model": "Unknown", "vendor": "PC/Desktop", "browser": "Unknown", "osVersion": "Unknown", "browserVersion": "Unknown"}	2026-02-25 09:42:30.274273	9c195536-7f95-45ed-81c5-ffbd047e79d2
1588	162	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNjIsInVzZXJuYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImpodW5ndWlkZWZAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzcxOTg1NTc0LCJleHAiOjE3NzcxNjk1NzR9.iXLFPRD4x9nQFluw7pYn_MSg_fxmKv5dK70hCsIYKZU	{"os": "Unknown", "model": "Unknown", "vendor": "PC/Desktop", "browser": "Unknown", "osVersion": "Unknown", "browserVersion": "Unknown"}	2026-02-25 10:12:54.085833	7c651721-e94d-4843-8d5d-8f4fa9f45ea6
1593	162	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNjIsInVzZXJuYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImpodW5ndWlkZWZAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzcyMDA0MzI4LCJleHAiOjE3NzcxODgzMjh9.iHRqBXYTd39R8L8qkNFVYSHTB17K8gx4wd6ULtR6lyU	{"os": "Unknown", "model": "Unknown", "vendor": "PC/Desktop", "browser": "Unknown", "osVersion": "Unknown", "browserVersion": "Unknown"}	2026-02-25 15:25:28.163376	c860d857-91d8-44c9-9c1a-6ea2c568f0f7
1604	162	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNjIsInVzZXJuYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImpodW5ndWlkZWZAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzcyMDE1NDc3LCJleHAiOjE3NzcxOTk0Nzd9.76mVBZECKuHgH057v_4chMpOWpE2npbMRKsTZXgO31g	{"os": "Unknown", "model": "Unknown", "vendor": "PC/Desktop", "browser": "Unknown", "osVersion": "Unknown", "browserVersion": "Unknown"}	2026-02-25 18:31:17.092328	2368b7d7-8b44-4f22-b0ac-10eca5cc0d28
1543	214	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyMTQsInVzZXJuYW1lIjoiUm9uYWxkIiwiZW1haWwiOiJyb25hbGRAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzcxODExMjgzLCJleHAiOjE3NzY5OTUyODN9.6b5RnTT0S6zm54W8Ab300sOYwfylmw6QAKOSCvw-ZX4	{"os": "Windows", "model": "Unknown", "vendor": "PC/Desktop", "browser": "Chrome", "osVersion": "10", "browserVersion": "141.0.0.0"}	2026-02-23 09:48:03.201636	89e73092-7409-4d96-b62e-77bc8ae80d46
1556	162	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNjIsInVzZXJuYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImpodW5ndWlkZWZAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzcxODUyMjQ5LCJleHAiOjE3NzcwMzYyNDl9.uG4ltsbQu8sWn7K6UPOD7JkfUYzOvLTrTsiGqUXiTrM	{"os": "Android", "model": "Nexus 5", "vendor": "LG", "browser": "Mobile Chrome", "osVersion": "6.0", "browserVersion": "141.0.0.0"}	2026-02-23 21:10:49.671504	b6dc4dc3-e9ca-481e-aa0d-70aa32f01e19
1561	162	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNjIsInVzZXJuYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImpodW5ndWlkZWZAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzcxODYyMzc3LCJleHAiOjE3NzcwNDYzNzd9.mu4rbS4mxbZHJBZ5JbA13_uY069cErt9W9dP_mXwtzo	{"os": "Android", "model": "Nexus 5", "vendor": "LG", "browser": "Mobile Chrome", "osVersion": "6.0", "browserVersion": "141.0.0.0"}	2026-02-23 23:59:37.399103	296a178a-f0b5-4869-9a62-22166eaec0a7
1503	162	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNjIsInVzZXJuYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImpodW5ndWlkZWZAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzcxNzcyODUwLCJleHAiOjE3NzY5NTY4NTB9.Bt50EJ1n2I_B6oUSyZg-pwARGj3uWqRefSl6bN489AU	{"os": "Unknown", "model": "Unknown", "vendor": "PC/Desktop", "browser": "Unknown", "osVersion": "Unknown", "browserVersion": "Unknown"}	2026-02-22 23:07:30.773063	8c00ba1d-6f9b-427b-9076-7694377179a2
1609	162	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNjIsInVzZXJuYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImpodW5ndWlkZWZAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzcyMDI5MDA0LCJleHAiOjE3NzcyMTMwMDR9.e-VorwlSLhC_I4het8C4voc-FJxB0fjyPR1B1Mmp9f8	{"os": "Unknown", "model": "Unknown", "vendor": "PC/Desktop", "browser": "Unknown", "osVersion": "Unknown", "browserVersion": "Unknown"}	2026-02-25 22:16:44.398055	467251f8-3aaa-40bc-9e01-b804f0bd7872
1614	162	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNjIsInVzZXJuYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImpodW5ndWlkZWZAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzcyMDM2MzgwLCJleHAiOjE3NzcyMjAzODB9.5mzfeoVAPiJP0x8MSvggoLi7NECnSBGnxrymYii-aqg	{"os": "Windows", "model": "Unknown", "vendor": "PC/Desktop", "browser": "Chrome", "osVersion": "10", "browserVersion": "141.0.0.0"}	2026-02-26 00:19:40.394312	b5b39656-a4cf-4e1c-9f56-049ba00df7fb
1584	162	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNjIsInVzZXJuYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImpodW5ndWlkZWZAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzcxOTg0MjgyLCJleHAiOjE3NzcxNjgyODJ9.0DO6SbMyP2DeVe5PM3o1-pe5tY8DIYIER3QY5mBRu-M	{"os": "Unknown", "model": "Unknown", "vendor": "PC/Desktop", "browser": "Unknown", "osVersion": "Unknown", "browserVersion": "Unknown"}	2026-02-25 09:51:22.7416	12d25cc9-8b5e-4452-9f80-bdc4497aca2b
1589	162	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNjIsInVzZXJuYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImpodW5ndWlkZWZAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzcxOTg3MTAyLCJleHAiOjE3NzcxNzExMDJ9.rBNX9e6e2DI_qee_KYVS5xpkRKlPO0oCtx1QBh9FCk4	{"os": "Unknown", "model": "Unknown", "vendor": "PC/Desktop", "browser": "Unknown", "osVersion": "Unknown", "browserVersion": "Unknown"}	2026-02-25 10:38:22.667699	9b03fb11-3109-4c8b-a518-355bf2c1ccc3
1600	162	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNjIsInVzZXJuYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImpodW5ndWlkZWZAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzcyMDEyOTU5LCJleHAiOjE3NzcxOTY5NTl9.quplzZ5Ae2qNcNYxRbpg5w-xQK2QsgyW4Z3dT_skFtY	{"os": "Windows", "model": "Unknown", "vendor": "PC/Desktop", "browser": "Chrome", "osVersion": "10", "browserVersion": "141.0.0.0"}	2026-02-25 17:49:19.252687	7d8c7130-85a3-4886-8094-ca7849f70852
1605	162	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNjIsInVzZXJuYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImpodW5ndWlkZWZAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzcyMDE1NTU1LCJleHAiOjE3NzcxOTk1NTV9.tW6r_jYfoD2Tu-k1fAucOznDh8xctpbJ4Chb0qPSvdw	{"os": "iOS", "model": "iPhone", "vendor": "Apple", "browser": "Mobile Safari", "osVersion": "18.5", "browserVersion": "18.5"}	2026-02-25 18:32:35.351393	6034fbd8-0c63-4fc6-a25b-aa65ef4fc422
1610	162	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNjIsInVzZXJuYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImpodW5ndWlkZWZAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzcyMDMzNDUwLCJleHAiOjE3NzcyMTc0NTB9.hpi1-piFnl6iZ-NXXMPFtqjQCwb1npnGzWXTagqvIPk	{"os": "Unknown", "model": "Unknown", "vendor": "PC/Desktop", "browser": "Unknown", "osVersion": "Unknown", "browserVersion": "Unknown"}	2026-02-25 23:30:50.099703	b160dbd4-ae6f-41fc-b051-88cdec668ea9
1615	162	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNjIsInVzZXJuYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImpodW5ndWlkZWZAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzcyMDQxMzkwLCJleHAiOjE3NzcyMjUzOTB9.du5ktHMgTaTZC7gx3DCMmYgvDAJITFSPTXeyR8tYWA8	{"os": "Windows", "model": "Unknown", "vendor": "PC/Desktop", "browser": "Chrome", "osVersion": "10", "browserVersion": "141.0.0.0"}	2026-02-26 01:43:10.951418	090d0ef1-79f0-4030-a113-3f199a600174
1562	162	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNjIsInVzZXJuYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImpodW5ndWlkZWZAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzcxOTAzNDQwLCJleHAiOjE3NzcwODc0NDB9.qO-bscLOKZWuRLCajU0ykOUCQyIhAG9Lzzv_8UorziQ	{"os": "Windows", "model": "Unknown", "vendor": "PC/Desktop", "browser": "Chrome", "osVersion": "10", "browserVersion": "141.0.0.0"}	2026-02-24 11:24:00.637512	5461b6ce-1172-4704-ba3c-b2869e2c0b35
\.


--
-- Data for Name: tray_groups; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tray_groups (tray_group_id, tray_group_name, group_number, min_moisture, max_moisture, is_watering, location, created_at, updated_at) FROM stdin;
8	Bokchoy	1	50	70	f	Right 1	2026-02-11 17:24:48.760034	2026-02-11 17:25:07.972673
9	Pechay	1	50	70	f	Right 2	2026-02-11 17:25:15.68958	2026-02-11 17:25:20.408402
10	Mustasa	1	55	70	f	Right 3	2026-02-11 17:25:26.456521	2026-02-11 17:25:26.456521
13	Lettuce	1	50	75	f	Left 1	2026-02-25 18:07:55.503802	2026-02-25 18:07:55.503802
14	Bokchoy	2	50	70	f	Right 2	2026-02-25 18:08:13.601503	2026-02-25 18:08:13.601503
\.


--
-- Data for Name: trays; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.trays (tray_id, tray_group_id, tray_number, plant, status, created_at, updated_at) FROM stdin;
14	8	1	Bokchoy	Occupied	2026-02-11 17:25:33.290583	2026-02-12 16:42:01.904398
15	9	1	Pechay	Occupied	2026-02-11 17:25:34.676666	2026-02-12 16:42:04.891554
16	10	1	Mustasa	Occupied	2026-02-11 17:25:35.974407	2026-02-12 16:42:07.976908
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, username, fullname, email, phone_number, password_hash, role, status, created_at, first_time_login) FROM stdin;
162	admin	Admin	jhunguidef@gmail.com	09684368475	$2b$10$kBWOHeXAt2edD9SeaWM9BO4UZdVseWTyRM8IuVKMARMGxQrEZ6mtG	admin	active	2025-11-10 17:33:35.231015	f
224	rad	rad	rad@gmail.com		$2b$10$2jwAGNjw99ECvVXXCwJhROBsaxEepRCWL31r4uaDXViuje2KVXqkS	admin	\N	2026-02-23 23:55:03.742032	f
223	van	vane	vanessa@gmail.com		$2b$10$a0QzIL.3JuXRCsSfgw8FeOI5nV04IRznGTfGp0EaL9JQmQDTAQmki	viewer	\N	2026-02-23 23:54:52.928435	f
215	john	john doe	jd@gmail.com	09121313131	$2b$10$K3kiCeOwJ2HLFJDl8CbmYeavI.IBbRKfNBX8qFfDBJMuODL76xYr.	admin	\N	2026-02-20 10:53:40.961148	t
214	Ronald	Ronald	ronald@gmail.com		$2b$10$5J3qwSzTlEdTl.8L5UhxaOMQ0P5ee6R.7wPYInv9L40bIzbg/9zi2	admin	\N	2026-02-19 22:59:48.92118	t
\.


--
-- Data for Name: valves; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.valves (valve_id, valve_name, mode) FROM stdin;
1	ALL	AUTO
2	BOKCHOY	AUTO
3	PECHAY	AUTO
4	MUSTASA	AUTO
\.


--
-- Name: device_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.device_tokens_id_seq', 206, true);


--
-- Name: notifications_notification_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notifications_notification_id_seq', 5320, true);


--
-- Name: plant_batch_history_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.plant_batch_history_history_id_seq', 100, true);


--
-- Name: plant_batches_batch_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.plant_batches_batch_id_seq', 194, true);


--
-- Name: plant_groups_plant_group_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.plant_groups_plant_group_id_seq', 4, true);


--
-- Name: plants_plant_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.plants_plant_id_seq', 37, true);


--
-- Name: sensor_readings_reading_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sensor_readings_reading_id_seq', 4923, true);


--
-- Name: sensors_sensor_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sensors_sensor_id_seq', 8, true);


--
-- Name: tokens_token_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tokens_token_id_seq', 1616, true);


--
-- Name: tray_groups_tray_group_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tray_groups_tray_group_id_seq', 14, true);


--
-- Name: trays_tray_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.trays_tray_id_seq', 20, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 233, true);


--
-- Name: valves_valve_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.valves_valve_id_seq', 4, true);


--
-- Name: device_tokens device_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.device_tokens
    ADD CONSTRAINT device_tokens_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (notification_id);


--
-- Name: plant_batch_history plant_batch_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plant_batch_history
    ADD CONSTRAINT plant_batch_history_pkey PRIMARY KEY (history_id);


--
-- Name: plant_batches plant_batches_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plant_batches
    ADD CONSTRAINT plant_batches_pkey PRIMARY KEY (batch_id);


--
-- Name: plant_groups plant_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plant_groups
    ADD CONSTRAINT plant_groups_pkey PRIMARY KEY (plant_group_id);


--
-- Name: plants plants_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plants
    ADD CONSTRAINT plants_pkey PRIMARY KEY (plant_id);


--
-- Name: sensor_readings sensor_readings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sensor_readings
    ADD CONSTRAINT sensor_readings_pkey PRIMARY KEY (reading_id);


--
-- Name: sensors sensors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sensors
    ADD CONSTRAINT sensors_pkey PRIMARY KEY (sensor_id);


--
-- Name: tokens tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tokens
    ADD CONSTRAINT tokens_pkey PRIMARY KEY (token_id);


--
-- Name: tray_groups tray_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tray_groups
    ADD CONSTRAINT tray_groups_pkey PRIMARY KEY (tray_group_id);


--
-- Name: tray_groups tray_groups_tray_group_name_group_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tray_groups
    ADD CONSTRAINT tray_groups_tray_group_name_group_number_key UNIQUE (tray_group_name, group_number);


--
-- Name: trays trays_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trays
    ADD CONSTRAINT trays_pkey PRIMARY KEY (tray_id);


--
-- Name: plant_batch_history unique_history_per_plant; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plant_batch_history
    ADD CONSTRAINT unique_history_per_plant UNIQUE (plant_name, history_number);


--
-- Name: device_tokens unique_user_push_token; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.device_tokens
    ADD CONSTRAINT unique_user_push_token UNIQUE (user_id, push_token);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: valves valves_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.valves
    ADD CONSTRAINT valves_pkey PRIMARY KEY (valve_id);


--
-- Name: valves valves_valve_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.valves
    ADD CONSTRAINT valves_valve_name_key UNIQUE (valve_name);


--
-- Name: device_tokens device_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.device_tokens
    ADD CONSTRAINT device_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: plant_batch_history fk_batch; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plant_batch_history
    ADD CONSTRAINT fk_batch FOREIGN KEY (batch_id) REFERENCES public.plant_batches(batch_id) ON DELETE SET NULL;


--
-- Name: plants fk_group; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plants
    ADD CONSTRAINT fk_group FOREIGN KEY (group_id) REFERENCES public.plant_groups(plant_group_id) ON DELETE SET NULL;


--
-- Name: notifications fk_notifications_batch; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT fk_notifications_batch FOREIGN KEY (batch_id) REFERENCES public.plant_batches(batch_id) ON DELETE SET NULL;


--
-- Name: plant_batches fk_tray; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plant_batches
    ADD CONSTRAINT fk_tray FOREIGN KEY (tray_id) REFERENCES public.trays(tray_id) ON DELETE CASCADE;


--
-- Name: notifications notifications_related_sensor_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_related_sensor_fkey FOREIGN KEY (related_sensor) REFERENCES public.sensors(sensor_id);


--
-- Name: sensor_readings sensor_readings_sensor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sensor_readings
    ADD CONSTRAINT sensor_readings_sensor_id_fkey FOREIGN KEY (sensor_id) REFERENCES public.sensors(sensor_id);


--
-- Name: sensors sensors_tray_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sensors
    ADD CONSTRAINT sensors_tray_id_fkey FOREIGN KEY (tray_id) REFERENCES public.trays(tray_id);


--
-- Name: tokens tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tokens
    ADD CONSTRAINT tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: trays trays_tray_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trays
    ADD CONSTRAINT trays_tray_group_id_fkey FOREIGN KEY (tray_group_id) REFERENCES public.tray_groups(tray_group_id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict OiCwhv4jSUAkv3NBeljchmyuXgkqZonhYbDf4jAfkRef7dMZv6jTxegnbaXpJG5

