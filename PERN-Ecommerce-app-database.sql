--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

-- Started on 2025-07-24 00:16:26

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
-- TOC entry 855 (class 1247 OID 24577)
-- Name: care_level_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.care_level_enum AS ENUM (
    'Very Easy',
    'Easy',
    'Moderate',
    'Difficult'
);


ALTER TYPE public.care_level_enum OWNER TO postgres;

--
-- TOC entry 858 (class 1247 OID 24586)
-- Name: reef_safe_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.reef_safe_enum AS ENUM (
    'Yes',
    'No',
    'With Caution'
);


ALTER TYPE public.reef_safe_enum OWNER TO postgres;

--
-- TOC entry 861 (class 1247 OID 24592)
-- Name: temperament_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.temperament_enum AS ENUM (
    'Peaceful',
    'Mostly Peaceful',
    'Semi-Aggressive',
    'Aggressive',
    'Very Aggressive',
    'Mildly Aggressive'
);


ALTER TYPE public.temperament_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 222 (class 1259 OID 32850)
-- Name: cart_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_items (
    id integer NOT NULL,
    user_id integer,
    product_id integer,
    quantity integer NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.cart_items OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 32849)
-- Name: cart_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cart_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cart_items_id_seq OWNER TO postgres;

--
-- TOC entry 4861 (class 0 OID 0)
-- Dependencies: 221
-- Name: cart_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cart_items_id_seq OWNED BY public.cart_items.id;


--
-- TOC entry 226 (class 1259 OID 32902)
-- Name: order_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_items (
    id integer NOT NULL,
    order_id integer,
    product_id integer,
    quantity integer NOT NULL,
    price_each numeric(10,2) NOT NULL
);


ALTER TABLE public.order_items OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 32901)
-- Name: order_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_items_id_seq OWNER TO postgres;

--
-- TOC entry 4862 (class 0 OID 0)
-- Dependencies: 225
-- Name: order_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_items_id_seq OWNED BY public.order_items.id;


--
-- TOC entry 224 (class 1259 OID 32887)
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    user_id integer,
    first_name character varying(255) NOT NULL,
    last_name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    phone_number character varying(20) NOT NULL,
    address_line1 text NOT NULL,
    address_line2 character varying(255),
    city character varying(255) NOT NULL,
    state character varying(2) NOT NULL,
    postal_code character varying(20) NOT NULL,
    sub_total numeric(10,2) NOT NULL,
    shipping_cost numeric(10,2) NOT NULL,
    tax_amount numeric(10,2) NOT NULL,
    total numeric(10,2) NOT NULL,
    placed_at bigint DEFAULT ((EXTRACT(epoch FROM now()) * (1000)::numeric))::bigint
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 32886)
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orders_id_seq OWNER TO postgres;

--
-- TOC entry 4863 (class 0 OID 0)
-- Dependencies: 223
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- TOC entry 218 (class 1259 OID 24626)
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id integer NOT NULL,
    display_name character varying(255) NOT NULL,
    other_names text,
    sci_name text NOT NULL,
    category character varying(50) NOT NULL,
    species_type text,
    tank_roles text,
    about text NOT NULL,
    temperament public.temperament_enum,
    avg_adult_size text,
    reef_safe public.reef_safe_enum,
    care_level public.care_level_enum,
    lighting_needs text,
    flow_needs text,
    placement_advice text,
    price numeric(10,2) NOT NULL,
    stock integer DEFAULT 0,
    image_url character varying(255),
    created_at bigint DEFAULT (floor((EXTRACT(epoch FROM now()) * (1000)::numeric)))::bigint
);


ALTER TABLE public.products OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 24625)
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_id_seq OWNER TO postgres;

--
-- TOC entry 4864 (class 0 OID 0)
-- Dependencies: 217
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- TOC entry 220 (class 1259 OID 32834)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    first_name character varying(255),
    last_name character varying(255),
    username character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    phone_number character varying(20),
    created_at bigint DEFAULT ((EXTRACT(epoch FROM now()) * (1000)::numeric))::bigint,
    password_hash text,
    google_id text,
    address_line1 text,
    address_line2 character varying(255),
    city character varying(255),
    state character varying(2),
    postal_code character varying(20)
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 32833)
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
-- TOC entry 4865 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4675 (class 2604 OID 32853)
-- Name: cart_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items ALTER COLUMN id SET DEFAULT nextval('public.cart_items_id_seq'::regclass);


--
-- TOC entry 4679 (class 2604 OID 32905)
-- Name: order_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items ALTER COLUMN id SET DEFAULT nextval('public.order_items_id_seq'::regclass);


--
-- TOC entry 4677 (class 2604 OID 32890)
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- TOC entry 4670 (class 2604 OID 24629)
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- TOC entry 4673 (class 2604 OID 32837)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 4851 (class 0 OID 32850)
-- Dependencies: 222
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.cart_items (id, user_id, product_id, quantity, created_at) VALUES (256, 1, 5, 1, '2025-07-12 08:23:09.152315');


--
-- TOC entry 4855 (class 0 OID 32902)
-- Dependencies: 226
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.order_items (id, order_id, product_id, quantity, price_each) VALUES (83, 30, 5, 1, 15.00);
INSERT INTO public.order_items (id, order_id, product_id, quantity, price_each) VALUES (84, 30, 8, 1, 20.00);
INSERT INTO public.order_items (id, order_id, product_id, quantity, price_each) VALUES (85, 30, 2, 1, 15.00);
INSERT INTO public.order_items (id, order_id, product_id, quantity, price_each) VALUES (86, 30, 11, 1, 35.00);
INSERT INTO public.order_items (id, order_id, product_id, quantity, price_each) VALUES (87, 30, 14, 1, 30.00);
INSERT INTO public.order_items (id, order_id, product_id, quantity, price_each) VALUES (92, 33, 2, 1, 15.00);
INSERT INTO public.order_items (id, order_id, product_id, quantity, price_each) VALUES (93, 33, 5, 1, 15.00);
INSERT INTO public.order_items (id, order_id, product_id, quantity, price_each) VALUES (94, 33, 11, 1, 35.00);
INSERT INTO public.order_items (id, order_id, product_id, quantity, price_each) VALUES (95, 33, 15, 1, 50.00);
INSERT INTO public.order_items (id, order_id, product_id, quantity, price_each) VALUES (96, 33, 3, 1, 35.00);
INSERT INTO public.order_items (id, order_id, product_id, quantity, price_each) VALUES (97, 34, 9, 1, 60.00);
INSERT INTO public.order_items (id, order_id, product_id, quantity, price_each) VALUES (98, 34, 12, 1, 20.00);
INSERT INTO public.order_items (id, order_id, product_id, quantity, price_each) VALUES (99, 34, 6, 1, 25.00);
INSERT INTO public.order_items (id, order_id, product_id, quantity, price_each) VALUES (100, 34, 15, 1, 50.00);
INSERT INTO public.order_items (id, order_id, product_id, quantity, price_each) VALUES (101, 34, 3, 1, 35.00);
INSERT INTO public.order_items (id, order_id, product_id, quantity, price_each) VALUES (102, 35, 8, 1, 20.00);
INSERT INTO public.order_items (id, order_id, product_id, quantity, price_each) VALUES (103, 35, 2, 1, 15.00);
INSERT INTO public.order_items (id, order_id, product_id, quantity, price_each) VALUES (104, 35, 5, 1, 15.00);
INSERT INTO public.order_items (id, order_id, product_id, quantity, price_each) VALUES (105, 35, 11, 1, 35.00);
INSERT INTO public.order_items (id, order_id, product_id, quantity, price_each) VALUES (106, 35, 14, 1, 30.00);
INSERT INTO public.order_items (id, order_id, product_id, quantity, price_each) VALUES (107, 36, 7, 1, 40.00);
INSERT INTO public.order_items (id, order_id, product_id, quantity, price_each) VALUES (108, 36, 10, 1, 30.00);
INSERT INTO public.order_items (id, order_id, product_id, quantity, price_each) VALUES (109, 36, 4, 1, 50.00);
INSERT INTO public.order_items (id, order_id, product_id, quantity, price_each) VALUES (110, 36, 1, 1, 35.00);
INSERT INTO public.order_items (id, order_id, product_id, quantity, price_each) VALUES (111, 36, 13, 1, 80.00);
INSERT INTO public.order_items (id, order_id, product_id, quantity, price_each) VALUES (112, 37, 1, 2, 35.00);
INSERT INTO public.order_items (id, order_id, product_id, quantity, price_each) VALUES (113, 37, 7, 2, 40.00);
INSERT INTO public.order_items (id, order_id, product_id, quantity, price_each) VALUES (114, 37, 10, 2, 30.00);
INSERT INTO public.order_items (id, order_id, product_id, quantity, price_each) VALUES (115, 37, 8, 2, 20.00);
INSERT INTO public.order_items (id, order_id, product_id, quantity, price_each) VALUES (116, 37, 11, 2, 35.00);
INSERT INTO public.order_items (id, order_id, product_id, quantity, price_each) VALUES (117, 37, 14, 2, 30.00);
INSERT INTO public.order_items (id, order_id, product_id, quantity, price_each) VALUES (118, 37, 2, 2, 15.00);
INSERT INTO public.order_items (id, order_id, product_id, quantity, price_each) VALUES (119, 37, 15, 2, 50.00);
INSERT INTO public.order_items (id, order_id, product_id, quantity, price_each) VALUES (120, 37, 3, 2, 35.00);
INSERT INTO public.order_items (id, order_id, product_id, quantity, price_each) VALUES (121, 37, 9, 2, 60.00);
INSERT INTO public.order_items (id, order_id, product_id, quantity, price_each) VALUES (122, 37, 12, 2, 20.00);
INSERT INTO public.order_items (id, order_id, product_id, quantity, price_each) VALUES (123, 38, 10, 2, 30.00);
INSERT INTO public.order_items (id, order_id, product_id, quantity, price_each) VALUES (124, 38, 1, 2, 35.00);
INSERT INTO public.order_items (id, order_id, product_id, quantity, price_each) VALUES (125, 38, 7, 2, 40.00);
INSERT INTO public.order_items (id, order_id, product_id, quantity, price_each) VALUES (126, 39, 8, 1, 20.00);
INSERT INTO public.order_items (id, order_id, product_id, quantity, price_each) VALUES (127, 39, 14, 1, 30.00);
INSERT INTO public.order_items (id, order_id, product_id, quantity, price_each) VALUES (128, 39, 11, 1, 35.00);
INSERT INTO public.order_items (id, order_id, product_id, quantity, price_each) VALUES (129, 40, 15, 1, 50.00);
INSERT INTO public.order_items (id, order_id, product_id, quantity, price_each) VALUES (130, 40, 3, 1, 35.00);
INSERT INTO public.order_items (id, order_id, product_id, quantity, price_each) VALUES (131, 40, 9, 1, 60.00);
INSERT INTO public.order_items (id, order_id, product_id, quantity, price_each) VALUES (132, 41, 14, 1, 30.00);
INSERT INTO public.order_items (id, order_id, product_id, quantity, price_each) VALUES (133, 42, 7, 1, 40.00);
INSERT INTO public.order_items (id, order_id, product_id, quantity, price_each) VALUES (134, 42, 1, 1, 35.00);
INSERT INTO public.order_items (id, order_id, product_id, quantity, price_each) VALUES (135, 43, 10, 1, 30.00);
INSERT INTO public.order_items (id, order_id, product_id, quantity, price_each) VALUES (136, 44, 12, 1, 20.00);
INSERT INTO public.order_items (id, order_id, product_id, quantity, price_each) VALUES (137, 45, 9, 1, 60.00);
INSERT INTO public.order_items (id, order_id, product_id, quantity, price_each) VALUES (138, 45, 7, 1, 40.00);
INSERT INTO public.order_items (id, order_id, product_id, quantity, price_each) VALUES (139, 45, 1, 1, 35.00);
INSERT INTO public.order_items (id, order_id, product_id, quantity, price_each) VALUES (140, 45, 10, 1, 30.00);
INSERT INTO public.order_items (id, order_id, product_id, quantity, price_each) VALUES (141, 45, 3, 3, 35.00);
INSERT INTO public.order_items (id, order_id, product_id, quantity, price_each) VALUES (142, 46, 7, 1, 40.00);
INSERT INTO public.order_items (id, order_id, product_id, quantity, price_each) VALUES (143, 46, 1, 1, 35.00);
INSERT INTO public.order_items (id, order_id, product_id, quantity, price_each) VALUES (144, 46, 10, 1, 30.00);


--
-- TOC entry 4853 (class 0 OID 32887)
-- Dependencies: 224
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.orders (id, user_id, first_name, last_name, email, phone_number, address_line1, address_line2, city, state, postal_code, sub_total, shipping_cost, tax_amount, total, placed_at) VALUES (30, 1, 'Zachary', 'Taylor', 'dinky64@gmail.com', '1-800-234-9999', '30303 America Ave.', 'Liberty Stone apartment mailbox #313', 'Detriot', 'MI', '20999', 115.00, 8.00, 6.90, 129.90, 1750260151203);
INSERT INTO public.orders (id, user_id, first_name, last_name, email, phone_number, address_line1, address_line2, city, state, postal_code, sub_total, shipping_cost, tax_amount, total, placed_at) VALUES (33, 1, 'Zachary', 'Taylor', 'dinky64@gmail.com', '1-800-234-9999', '30303 America Ave.', 'Liberty Stone apartment mailbox #313', 'Detriot', 'MI', '20999', 150.00, 8.00, 9.00, 167.00, 1750428589794);
INSERT INTO public.orders (id, user_id, first_name, last_name, email, phone_number, address_line1, address_line2, city, state, postal_code, sub_total, shipping_cost, tax_amount, total, placed_at) VALUES (34, 1, 'Zachary', 'Taylor', 'dinky64@gmail.com', '1-800-234-9999', '30303 America Ave.', 'Liberty Stone apartment mailbox #313', 'Detriot', 'MI', '20999', 190.00, 8.00, 11.40, 209.40, 1750604506919);
INSERT INTO public.orders (id, user_id, first_name, last_name, email, phone_number, address_line1, address_line2, city, state, postal_code, sub_total, shipping_cost, tax_amount, total, placed_at) VALUES (35, 1, 'Zachary', 'Taylor', 'dinky64@gmail.com', '1-800-234-9999', '30303 America Ave.', 'Liberty Stone apartment mailbox #313', 'Detriot', 'MI', '20999', 115.00, 8.00, 6.90, 129.90, 1750604552842);
INSERT INTO public.orders (id, user_id, first_name, last_name, email, phone_number, address_line1, address_line2, city, state, postal_code, sub_total, shipping_cost, tax_amount, total, placed_at) VALUES (36, 1, 'Zachary', 'Taylor', 'dinky64@gmail.com', '1-800-234-9999', '30303 America Ave.', 'Liberty Stone apartment mailbox #313', 'Detriot', 'MI', '20999', 235.00, 8.00, 14.10, 257.10, 1750604610996);
INSERT INTO public.orders (id, user_id, first_name, last_name, email, phone_number, address_line1, address_line2, city, state, postal_code, sub_total, shipping_cost, tax_amount, total, placed_at) VALUES (37, 1, 'Zachary', 'Taylor', 'dinky64@gmail.com', '1-800-234-9999', '30303 America Ave.', 'Liberty Stone apartment mailbox #313', 'Detriot', 'MI', '20999', 740.00, 8.00, 44.40, 792.40, 1750607262103);
INSERT INTO public.orders (id, user_id, first_name, last_name, email, phone_number, address_line1, address_line2, city, state, postal_code, sub_total, shipping_cost, tax_amount, total, placed_at) VALUES (38, 1, 'Zachary', 'Taylor', 'dinky64@gmail.com', '1-800-234-9999', '30303 America Ave.', 'Liberty Stone apartment mailbox #313', 'Detriot', 'MI', '20999', 210.00, 8.00, 12.60, 230.60, 1750773542755);
INSERT INTO public.orders (id, user_id, first_name, last_name, email, phone_number, address_line1, address_line2, city, state, postal_code, sub_total, shipping_cost, tax_amount, total, placed_at) VALUES (39, 1, 'Zachary', 'Taylor', 'dinky64@gmail.com', '1-800-234-9999', '30303 America Ave.', 'Liberty Stone apartment mailbox #313', 'Detriot', 'MI', '20999', 85.00, 8.00, 5.10, 98.10, 1750773796293);
INSERT INTO public.orders (id, user_id, first_name, last_name, email, phone_number, address_line1, address_line2, city, state, postal_code, sub_total, shipping_cost, tax_amount, total, placed_at) VALUES (40, 1, 'Zachary', 'Taylor', 'dinky64@gmail.com', '1-800-234-9999', '30303 America Ave.', 'Liberty Stone apartment mailbox #313', 'Detriot', 'MI', '20999', 145.00, 8.00, 8.70, 161.70, 1750775910605);
INSERT INTO public.orders (id, user_id, first_name, last_name, email, phone_number, address_line1, address_line2, city, state, postal_code, sub_total, shipping_cost, tax_amount, total, placed_at) VALUES (41, 1, 'Zachary', 'Taylor', 'dinky64@gmail.com', '1-800-234-9999', '30303 America Ave.', 'Liberty Stone apartment mailbox #313', 'Detriot', 'MI', '20999', 30.00, 8.00, 1.80, 39.80, 1750775973506);
INSERT INTO public.orders (id, user_id, first_name, last_name, email, phone_number, address_line1, address_line2, city, state, postal_code, sub_total, shipping_cost, tax_amount, total, placed_at) VALUES (42, 1, 'Zachary', 'Taylor', 'dinky64@gmail.com', '1-800-234-9999', '30303 America Ave.', 'Liberty Stone apartment mailbox #313', 'Detriot', 'MI', '20999', 75.00, 8.00, 4.50, 87.50, 1750776138809);
INSERT INTO public.orders (id, user_id, first_name, last_name, email, phone_number, address_line1, address_line2, city, state, postal_code, sub_total, shipping_cost, tax_amount, total, placed_at) VALUES (43, 1, 'Zachary', 'Taylor', 'dinky64@gmail.com', '1-800-234-9999', '30303 America Ave.', 'Liberty Stone apartment mailbox #313', 'Detriot', 'MI', '20999', 30.00, 8.00, 1.80, 39.80, 1750776525828);
INSERT INTO public.orders (id, user_id, first_name, last_name, email, phone_number, address_line1, address_line2, city, state, postal_code, sub_total, shipping_cost, tax_amount, total, placed_at) VALUES (44, 1, 'Zachary', 'Taylor', 'dinky64@gmail.com', '1-800-234-9999', '30303 America Ave.', 'Liberty Stone apartment mailbox #313', 'Detriot', 'MI', '20999', 20.00, 8.00, 1.20, 29.20, 1750785753567);
INSERT INTO public.orders (id, user_id, first_name, last_name, email, phone_number, address_line1, address_line2, city, state, postal_code, sub_total, shipping_cost, tax_amount, total, placed_at) VALUES (45, 1, 'Zachary', 'Taylor', 'dinky64@gmail.com', '1-800-234-9999', '30303 America Ave.', 'Liberty Stone apartment mailbox #313', 'Detriot', 'MI', '20999', 270.00, 8.00, 16.20, 294.20, 1751516824555);
INSERT INTO public.orders (id, user_id, first_name, last_name, email, phone_number, address_line1, address_line2, city, state, postal_code, sub_total, shipping_cost, tax_amount, total, placed_at) VALUES (46, 1, 'Zachary', 'Taylor', 'dinky64@gmail.com', '1-800-234-9999', '30303 America Ave.', 'Liberty Stone apartment mailbox #313', 'Detriot', 'MI', '20999', 105.00, 8.00, 6.30, 119.30, 1752322965543);


--
-- TOC entry 4847 (class 0 OID 24626)
-- Dependencies: 218
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.products (id, display_name, other_names, sci_name, category, species_type, tank_roles, about, temperament, avg_adult_size, reef_safe, care_level, lighting_needs, flow_needs, placement_advice, price, stock, image_url, created_at) VALUES (11, 'Halloween Hermit Crab', 'Halloween (Reef) Crab, Striped Hermit Crab, *and* Orange Legged Hermit Crab', '*Ciliopagurus strigatus*', 'invertebrates', 'Crab', 'Display, Algae eater, *and* Scavenger', 'This hardy, colorful hermit crab is known for its bright orange and black legs, giving it the nickname "Halloween" crab. As both a scavenger and algae eater, it helps maintain tank cleanliness. To keep it reef-safe and prevent aggression toward snails for their shells, be sure to keep it well-fed and provide extra empty shells.', 'Semi-Aggressive', '2-3 inches', 'With Caution', 'Moderate', NULL, NULL, NULL, 35.00, 25, 'inverts_Halloween_Hermit_Crab.png', 1747260069815);
INSERT INTO public.products (id, display_name, other_names, sci_name, category, species_type, tank_roles, about, temperament, avg_adult_size, reef_safe, care_level, lighting_needs, flow_needs, placement_advice, price, stock, image_url, created_at) VALUES (4, 'Carpenter''s Flasher Wrasse', 'Carpenter''s Flasher Wrasse, Carpenter''s Wrasse, *and* Redfin Flasher Wrasse', '*Paracheilinus carpenteri*', 'fishes', 'Wrasse', 'Display, Active swimmer', 'This colorful display fish is a very active swimmer that needs space to swim. Its tank should have a lid to prevent jumping. It also prefers peaceful tankmates.', 'Peaceful', '2.5-3 inches', 'Yes', 'Moderate', NULL, NULL, NULL, 50.00, 29, 'fishes_Carpenters_Flasher_Wrasse.png', 1747255802023);
INSERT INTO public.products (id, display_name, other_names, sci_name, category, species_type, tank_roles, about, temperament, avg_adult_size, reef_safe, care_level, lighting_needs, flow_needs, placement_advice, price, stock, image_url, created_at) VALUES (12, 'Kenya Tree Coral', 'Cauliflower Soft Coral, Tree Coral, *and* Nephthea', '*Capnella spp.*', 'corals_&_anemones', 'Soft Coral', 'Display, Vertical-filler, Self-fragging, *and* Nano-friendly', 'This hardy soft coral grows vertically in a tree-like shape, adding height and motion to reef aquariums. It can propagate on its own by naturally dropping frags. With low care requirements and peaceful behavior, it''s a reliable tank filler for beginner-friendly soft coral setups.', 'Mildly Aggressive', NULL, NULL, 'Easy', '**Moderate (PAR 100–150)** – While adaptable, it grows best with moderate light.', '**Moderate** – Randomized flow helps promote healthy polyp extension and growth.', 'Place in mid to lower zone while allow space for coral growth and self-fragging.', 20.00, 26, 'corals_&_anemos_Kenya_Tree_Coral.png', 1747260712072);
INSERT INTO public.products (id, display_name, other_names, sci_name, category, species_type, tank_roles, about, temperament, avg_adult_size, reef_safe, care_level, lighting_needs, flow_needs, placement_advice, price, stock, image_url, created_at) VALUES (6, 'Pulsing Xenia', 'Pom Pom Coral, Xenia, *and* Pulse Coral', '*Xenia spp.*', 'corals_&_anemones', 'Soft Coral', 'Display, Adds motion, Fast spreading, *and* Mat-encrusting', 'This rhythmic soft coral adds eye-catching motion and texture to reef tanks. It grows rapidly and can become invasive if not isolated or regularly trimmed. Ideal for beginners, it thrives in peaceful, low-maintenance setups but should be placed away from slower-growing corals to avoid overgrowth.', 'Peaceful', NULL, NULL, 'Very Easy', '**Moderate (PAR 100–150)** – Prefers indirect but consistent lighting.', '**Moderate** – coral pulses and expand polyps best under swaying, indirect flow.', 'Place in mid to upper rockwork to ensure spread area. Also isolate to control fast spread when needed.', 25.00, 29, 'corals_&_anemos_Pulsing_Xenia.png', 1747257062795);
INSERT INTO public.products (id, display_name, other_names, sci_name, category, species_type, tank_roles, about, temperament, avg_adult_size, reef_safe, care_level, lighting_needs, flow_needs, placement_advice, price, stock, image_url, created_at) VALUES (1, 'Bicolor Blenny', 'Two-colored Blenny, Bicolor Combtooth Blenny, *and* Bicolor Coralblenny', '*Ecsenius bicolor*', 'fishes', 'Blenny', 'Algae eater', 'This hardy algae grazer likes to perch on rockwork, but may nip at fleshy corals if underfed.', 'Peaceful', '3-4 inches', 'Yes', 'Easy', NULL, NULL, NULL, 35.00, 22, 'fishes_Bicolor_Blenny.png', 1747254020585);
INSERT INTO public.products (id, display_name, other_names, sci_name, category, species_type, tank_roles, about, temperament, avg_adult_size, reef_safe, care_level, lighting_needs, flow_needs, placement_advice, price, stock, image_url, created_at) VALUES (9, 'Toadstool Leather', 'Mushroom Leather Coral *and* Leather Coral', '*Sarcophyton spp.*', 'corals_&_anemones', 'Soft Coral', 'Display, Centerpiece', 'This large, hardy soft coral makes for a reliable centerpiece for beginner-friendly reef tanks. Often grouped in "leather zones"—areas where leather corals are kept together due to similar care needs—it thrives under moderate lighting and low water flow. Its long tentacles periodically shed mucus during growth and may release mild defensive chemicals, making it slightly aggressive toward nearby tankmates.', 'Semi-Aggressive', NULL, NULL, 'Easy', '**Moderate (PAR 100–200)** – Tolerates most light conditions.', '**Moderate** – Medium flow promotes polyp extension and shedding.', 'Place in mid-zone and with moderate lighting and flow to ensure space to grow.', 60.00, 25, 'corals_&_anemos_Toadstool_Leather.png', 1747259315824);
INSERT INTO public.products (id, display_name, other_names, sci_name, category, species_type, tank_roles, about, temperament, avg_adult_size, reef_safe, care_level, lighting_needs, flow_needs, placement_advice, price, stock, image_url, created_at) VALUES (8, 'Electric Blue Hermit Crab', 'Electic Blue Crab, Blue Leg Hermit Crab, *and* Blue Knuckle Hermit Crab', '*Calcinus elegans*', 'invertebrates', 'Crab', 'Scavenger, Detritivore', 'Despite its striking blue appearance, this scavenger and detritivore helps keep the tank clean by consuming leftover food and waste. However, it may attack snails for their shells—so be sure to provide extra empty shells to minimize aggression and risk to other invertebrates.', 'Semi-Aggressive', '2 inches', 'Yes', 'Easy', NULL, NULL, NULL, 20.00, 26, 'inverts_Electric_Blue_Hermit_Crab.png', 1747258866936);
INSERT INTO public.products (id, display_name, other_names, sci_name, category, species_type, tank_roles, about, temperament, avg_adult_size, reef_safe, care_level, lighting_needs, flow_needs, placement_advice, price, stock, image_url, created_at) VALUES (5, 'Scarlet Hermit Crab', 'Scarlet Reef Hermit Crab, Red Reef Hermit Crab, *and* Red-legged Hermit Crab', '*Paguristes cadenati*', 'invertebrates', 'Crab', 'Detritivore', 'This hardy and peaceful hermit crab scavenges leftover food and algae, making it a valuable part of any reef tank''s cleanup crew. Its reef-safe nature and low-maintenance care make it an excellent option for beginners.', 'Peaceful', '1 inch', 'Yes', 'Very Easy', NULL, NULL, NULL, 15.00, 28, 'inverts_Scarlet_Hermit_Crab.png', 1747256353944);
INSERT INTO public.products (id, display_name, other_names, sci_name, category, species_type, tank_roles, about, temperament, avg_adult_size, reef_safe, care_level, lighting_needs, flow_needs, placement_advice, price, stock, image_url, created_at) VALUES (2, 'Emerald Crab', 'Green Clinging Crab, Jade Crab, *and* Mithrax Crab', '*Mithraculus sculptus*', 'invertebrates', 'Crab', 'Algae eater', 'This hardy, reef-safe crab known is known for its effectiveness against bubble algae infestations. While peaceful, it should be provided with sufficient algae or supplemental food to avoid aggression toward other tankmates or corals.', 'Peaceful', '2 inches', 'With Caution', 'Easy', NULL, NULL, NULL, 15.00, 26, 'inverts_Emerald_Crab.png', 1747254535291);
INSERT INTO public.products (id, display_name, other_names, sci_name, category, species_type, tank_roles, about, temperament, avg_adult_size, reef_safe, care_level, lighting_needs, flow_needs, placement_advice, price, stock, image_url, created_at) VALUES (7, 'Diamond Watchman Goby', 'Diamond Goby, Orange-Spotted Sleeper Goby, *and* Maiden Goby', '*Valenciennea puellaris*', 'fishes', 'Goby', 'Substrate cleaner', 'This bottom-dwelling vigorous sandsifter helps keep tank substrate clean. It may  rearrange sandbed structure, and can become territorial toward other gobies.', 'Peaceful', '4-5 inches', 'Yes', 'Moderate', NULL, NULL, NULL, 40.00, 22, 'fishes_Diamond_Watchman_Goby.png', 1747258369421);
INSERT INTO public.products (id, display_name, other_names, sci_name, category, species_type, tank_roles, about, temperament, avg_adult_size, reef_safe, care_level, lighting_needs, flow_needs, placement_advice, price, stock, image_url, created_at) VALUES (13, 'Flame Angelfish', 'Flame Angel, Flaming Angelfish, *and* Japanese Pygmy Angelfish', '*Centropyge loricula*', 'fishes', 'Angelfish', 'Display, Active swimmer', 'This active colorful fish makes for a great display, but it may graze on algae and rock surfaces, and occasionally nip at corals. Also, they can occasionally be aggressive due to their territorial nature and during mating season—especially between competing males. Besides requiring close observation in mixed reef tanks, it also requires stable water parameters.', 'Semi-Aggressive', '4 inches', 'With Caution', 'Moderate', NULL, NULL, NULL, 80.00, 29, 'fishes_Flame_Angelfish.png', 1747261726084);
INSERT INTO public.products (id, display_name, other_names, sci_name, category, species_type, tank_roles, about, temperament, avg_adult_size, reef_safe, care_level, lighting_needs, flow_needs, placement_advice, price, stock, image_url, created_at) VALUES (10, 'Firefish Goby', 'Firefish, Fire Dartfish, and Magnificent Firefish', '*Nemateleotris magnifica*', 'fishes', 'Goby', 'Active swimmer', 'This active, darting swimmer prefers a calm tank with peaceful tankmates. It’s shy and prone to jumping, so a secure lid is recommended.', 'Peaceful', '3 inches', 'Yes', 'Easy', NULL, NULL, NULL, 30.00, 22, 'fishes_Firefish_Goby.png', 1747259583832);
INSERT INTO public.products (id, display_name, other_names, sci_name, category, species_type, tank_roles, about, temperament, avg_adult_size, reef_safe, care_level, lighting_needs, flow_needs, placement_advice, price, stock, image_url, created_at) VALUES (15, 'Branching Hammerhead Coral', 'Branching Anchor Coral *and* Euphyllia Hammer Coral', '*Euphyllia paraancora*', 'corals_&_anemones', 'LPS (Large Polyp Stony) coral', 'Display, Centerpiece, Adds motion, *and* Fraggable', 'This coral has long, fleshy, hammer-shaped tentacles that sway beautifully in "flow-reactive zones"—areas with moderate, rythmic water movement for motion of tentacles. Unlike its wall-type cousin, *Euphyllia paraancora* is more beginner-friendly and easier to frag. While it has moderately strong sweepers, it can often be spaced closer to other branching hammers and frogspawn corals within *Euphyllia* gardens—just ensure moderate spacing to minimize the risk of aggression.', 'Aggressive', NULL, NULL, 'Moderate', '**Moderate (PAR 150–200)** – Prefers steady light exposure within this range.', '**Moderate** – Requires enough flow to keep tentacles extended and free from detritus buildup.', 'Place in lower to mid zone while giving at least 4"-6" space around coral to prevent stinging neighbors.', 50.00, 25, 'corals_anemos_Branching_Hammerhead_Coral.png', 1747262674656);
INSERT INTO public.products (id, display_name, other_names, sci_name, category, species_type, tank_roles, about, temperament, avg_adult_size, reef_safe, care_level, lighting_needs, flow_needs, placement_advice, price, stock, image_url, created_at) VALUES (14, 'Skunk Cleaner Shrimp', 'Pacific Cleaner Shrimp, Scarlet Cleaner Shrimp, *and* White-Banded Cleaner Shrimp', '*Lysmata amboinensis*', 'invertebrates', 'Shrimp', 'Cleaner', 'This hardy, social, and very helpful cleaner shrimp forms a symbiotic relationship with fish by removing parasites and dead tissue from their bodies. Its active cleaning behavior not only helps keep fish healthy but also contributes to overall reef tank health and cleanliness.', 'Peaceful', '2 inches', 'Yes', 'Easy', NULL, NULL, NULL, 30.00, 25, 'inverts_Skunk_Cleaner_Shrimp.png', 1747262230052);
INSERT INTO public.products (id, display_name, other_names, sci_name, category, species_type, tank_roles, about, temperament, avg_adult_size, reef_safe, care_level, lighting_needs, flow_needs, placement_advice, price, stock, image_url, created_at) VALUES (3, 'Green Star Polyps', 'GSP, Starburst Polyps, *and* Neon Green Star Polyps ', '*Pachyclavularia violacea*', 'corals_&_anemones', 'Soft Coral', 'Display, Mat-Encrusting, *and* Fast-spreading', 'This rock-covering soft coral is ideal for adding vibrant color to bare rock or tank walls. It spreads quickly as a hardy, fast-growing encrusting mat, making it perfect for covering unused or open rock surfaces. Its low maintenance and peaceful nature make it a safe option for reef beginners.', 'Peaceful', NULL, NULL, 'Very Easy', '**Low (PAR 50–100)** – Thrives in shaded and low-light areas.', '**Low** – Gentle indirect flow helps prevent detritus buildup.', 'Place around low rockwork or at back wall of tank. Also account for the coral being able to spread quickly.', 35.00, 22, 'corals_&_anemos_Green_Star_Polyps.png', 1747255352990);


--
-- TOC entry 4849 (class 0 OID 32834)
-- Dependencies: 220
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users (id, first_name, last_name, username, email, phone_number, created_at, password_hash, google_id, address_line1, address_line2, city, state, postal_code) VALUES (1, 'Zachary', 'Taylor', 'dinky64', 'dinky64@gmail.com', '1-800-234-9999', 1748877664064, '$2b$10$g6LvWTjXCnT5XpEqkP5BPuzAkPP84J8jGwdGrFKEqiF3FUoIqMpvO', NULL, '30303 America Ave.', 'Liberty Stone apartment mailbox #313', 'Detriot', 'MI', '20999');


--
-- TOC entry 4866 (class 0 OID 0)
-- Dependencies: 221
-- Name: cart_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cart_items_id_seq', 256, true);


--
-- TOC entry 4867 (class 0 OID 0)
-- Dependencies: 225
-- Name: order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_items_id_seq', 144, true);


--
-- TOC entry 4868 (class 0 OID 0)
-- Dependencies: 223
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_id_seq', 46, true);


--
-- TOC entry 4869 (class 0 OID 0)
-- Dependencies: 217
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 15, true);


--
-- TOC entry 4870 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 26, true);


--
-- TOC entry 4691 (class 2606 OID 32856)
-- Name: cart_items cart_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_pkey PRIMARY KEY (id);


--
-- TOC entry 4695 (class 2606 OID 32907)
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- TOC entry 4693 (class 2606 OID 32895)
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- TOC entry 4681 (class 2606 OID 24635)
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- TOC entry 4683 (class 2606 OID 32846)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4685 (class 2606 OID 32848)
-- Name: users users_google_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_google_id_key UNIQUE (google_id);


--
-- TOC entry 4687 (class 2606 OID 32842)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4689 (class 2606 OID 32844)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 4696 (class 2606 OID 32862)
-- Name: cart_items cart_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- TOC entry 4697 (class 2606 OID 32857)
-- Name: cart_items cart_items_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4699 (class 2606 OID 32908)
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- TOC entry 4700 (class 2606 OID 32913)
-- Name: order_items order_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- TOC entry 4698 (class 2606 OID 32896)
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


-- Completed on 2025-07-24 00:16:32

--
-- PostgreSQL database dump complete
--

