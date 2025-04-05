
-- Active: 1732688637371@@127.0.0.1@3306@Kopuragi-- Active: 1739513174980@@127.0.0.1@3306@kopuragi-- Active: 1732688612707@@127.0.0.1@3306@kopuragi-- Active: 1739513174980@@127.0.0.1@3306@kopuragi

#데이터베이스 생성
CREATE DATABASE Kopuragi DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci;

#계정명 및 비밀번호 설정
CREATE USER 'shikshokk'@'%' IDENTIFIED BY '4321';

#계정 사용하기//////
USE Kopuragi;

#계정에게 권한 부여
GRANT ALL PRIVILEGES ON *.* TO 'shikshokk'@'%' WITH GRANT OPTION;

#계정이 제대로 생성되었는지 확인
SHOW DATABASES;
USE kopuragi;


DROP TABLE 





#??
FLUSH PRIVILEGES;
#테이블 조회
SHOW TABLES ;

SELECT * FROM orderedmenu;
SELECT * FROM orderedvisitor;

DELIMITER $$

DROP TABLE orderedmenu;

INSERT INTO orderedMenu (menuName, price, totalPrice, visitTime, shop_order_id) VALUES
('김치찌개', '8000', '16000', '2025-01-10', 1),
('김치찌개', '8000', '16000', '2025-01-10', 1),
('김치찌개', '8000', '16000', '2025-01-10', 1),
('김치찌개', '8000', '16000', '2025-01-10', 1),
('불고기', '8000', '16000', '2025-01-10', 2),
('불고기', '8000', '16000', '2025-01-10', 2),
('불고기', '8000', '16000', '2025-01-10', 2),
('불고기', '12000', '24000', '2025-01-22', 3),
('불고기', '12000', '24000', '2025-01-22', 3),
('불고기', '12000', '24000', '2025-01-22', 3),
('불고기', '12000', '24000', '2025-01-22', 3),
('제육볶음', '9000', '18000', '2025-02-05', 4),
('된장찌개', '7000', '14000', '2025-02-14', 5),
('갈비찜', '15000', '30000', '2025-02-28', 6),
('비빔밥', '7000', '14000', '2025-03-02', 7),
('닭갈비', '10000', '20000', '2025-03-10', 8),
('떡볶이', '4000', '8000', '2025-03-15', 9),
('라면', '3000', '6000', '2025-03-20', 10),
('삼겹살', '13000', '26000', '2025-03-25', 1);




INSERT INTO orderedVisitor (user_id, visitors, isTakeout, visitTime, shop_order_id) VALUES
('user1', 2, TRUE, '2025-01-25', 1),
('user1', 2, TRUE, '2025-01-25', 1),
('user1', 2, TRUE, '2025-01-26', 2),
('user1', 2, TRUE, '2025-01-27', 2),
('user2', 4, FALSE, '2025-01-25', 3),
('user2', 4, FALSE, '2025-01-26', 3),
('user2', 4, FALSE, '2025-01-27', 3),
('user3', 3, TRUE, '2025-02-10', 4),
('user4', 3, TRUE, '2025-02-10', 4),
('user5', 3, TRUE, '2025-02-10', 5),
('user3', 5, FALSE, '2025-02-25', 6),
('user2', 2, TRUE, '2025-03-05', 7),
('user4', 1, FALSE, '2025-03-12', 8),
('user3', 4, TRUE, '2025-01-30', 9),
('user5', 3, FALSE, '2025-02-18', 10),
('user1', 2, TRUE, '2025-03-28', 11),
('user4', 5, FALSE, '2025-01-08', 12),
('user10', 5, FALSE, '2025-01-08', 13);




#owner 샘플 데이터
SELECT * FROM owner;
TRUNCATE TABLE owner;
INSERT INTO owner (name, nickname, userid, pw, email, phone, join_date, isDelete, businessNumber, ownerShopname, ownerShopaddress, ownerShoptype) VALUE 
('임진우','지누','jinu0000','aaAA11!!','jinu@naver.com','010-0000-0000', '2025-01-01', false, '1111111111','스타벅스','서울시 도봉구','카페');


#shop 테이블 샘플 데이터
SELECT * FROM shop;
DESC shop;
TRUNCATE TABLE shop;
INSERT INTO shop (owner_id, shopName, businessNumber, shopAddress, shopPhone, shopType, shopOwner) VALUES 
(1, '투썸플레이스','1234567890','서울시 도봉구','02-222-2222','카페','이민철');

#menu 테이블 샘플 데이터
SELECT * FROM menu;
DROP TABLE menu;
DROP TABLE menufile;
DESC menu;
#menu 테이블의 내용을 전부 지운다.
TRUNCATE TABLE menu;

DROP TABLE menufile;
INSERT INTO menu (shop_menu_id, menuName, price, menudesc, category) VALUES 
(1, '얼그레이',4000,'시트러스 향이 나는 홍차','차');
INSERT INTO menu (shop_menu_id, menuName, price, menudesc, category) VALUES 
(2, '페퍼민트',4000,'시트러스 향이 나는 홍차','차');
INSERT INTO menu (shop_menu_id, menuName, price, menudesc, category) VALUES 
(3, '아메리카노',4000,'시트러스 향이 나는 홍차','커피');
INSERT INTO menu (shop_menu_id, menuName, price, menudesc, category) VALUES 
(4, '카페라떼',4000,'시트러스 향이 나는 홍차','커피');
INSERT INTO menu (shop_menu_id, menuName, price, menudesc, category) VALUES 
(5, '마끼아또',4000,'시트러스 향이 나는 홍차','커피');
INSERT INTO menu (shop_menu_id, menuName, price, menudesc, category) VALUES 
(6, '오렌지 주스',4000,'시트러스 향이 나는 홍차','주스');
INSERT INTO menu (shop_menu_id, menuName, price, menudesc, category) VALUES 
(7, '딸기주스',4000,'시트러스 향이 나는 홍차','주스');
INSERT INTO menu (shop_menu_id, menuName, price, menudesc, category) VALUES 
(8, '사과주스',4000,'시트러스 향이 나는 홍차','주스');


# 회원 추가
INSERT INTO customer VALUES(2,"손님테스트","손님테스트닉","none","useridT","$2b$10$Lem2dPKvGyavo1sI1R4byuov6LEmKXVXtdDza0oWe1TzwoZO1rvvi", "dfgj@dfg.com","01033333","2025-04-02T06:36:50.456Z","N","individual" );     