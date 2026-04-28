-- ============================================================
-- ScarletX Lingerie — Gerçek Ürün Seed Verisi (Shopier Export)
-- setup.sql çalıştıktan SONRA bu dosyayı çalıştır
-- ============================================================

-- ─── Admin Kullanıcı ────────────────────────────────────────────────────────
INSERT INTO "users" ("id","email","password","name","role","createdAt","updatedAt")
VALUES (
  'admin-scarletx-001',
  'admin@scarletxlingerie.com',
  '$2b$12$pMZAWujZPOPwnWLnAY6QOOIRHLuOK187Uh62qmrw4hwt4LXVtQC8q',
  'Admin', 'ADMIN', NOW(), NOW()
)
ON CONFLICT ("email") DO UPDATE
  SET "password" = EXCLUDED."password", "role" = 'ADMIN', "updatedAt" = NOW();

-- ─── Kategoriler ─────────────────────────────────────────────────────────────
INSERT INTO "categories" ("id","slug","name","order","isActive","createdAt","updatedAt") VALUES
  ('cat-kilot','kilot','Külot',1,TRUE,NOW(),NOW()),
  ('cat-tanga','tanga','Tanga',2,TRUE,NOW(),NOW()),
  ('cat-takim','takim','Takım',3,TRUE,NOW(),NOW()),
  ('cat-korse','korse','Korse',4,TRUE,NOW(),NOW())
ON CONFLICT ("slug") DO NOTHING;

-- ─── Koleksiyonlar ───────────────────────────────────────────────────────────
INSERT INTO "collections" ("id","slug","name","description","image","isActive","order","createdAt","updatedAt") VALUES
  ('col-gunluk','gunluk-premium','Günlük Premium','Günlük konfor, premium his. ScarletX iç giyim koleksiyonu.','https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=800',TRUE,1,NOW(),NOW()),
  ('col-nokturn','nokturn','Nokturn','Gecenin ruhuyla tasarlanan set ve takım koleksiyonu.','https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=800',TRUE,2,NOW(),NOW())
ON CONFLICT ("slug") DO NOTHING;

-- ─── Ürünler ─────────────────────────────────────────────────────────────────
INSERT INTO "products" ("id","slug","name","description","categoryId","collectionId","isFeatured","isNew","isActive","tags","createdAt","updatedAt") VALUES
  ('prod-sx-01','lacivert-gunluk-premium-kulot','Lacivert Günlük Premium Külot','S = 36 / M = 38 / L = 40   Serin ama derin.  Lacivertin asaletiyle tanış — her adımın dengeli, her hissin yumuşak.  Günün karmaşasında bedenine bir nefes, ruhuna bir mola.','cat-kilot','col-gunluk',true,TRUE,TRUE,ARRAY['külot','günlük','premium'],NOW(),NOW()),
  ('prod-sx-02','siyah-gunluk-premium-kulot','Siyah Günlük Premium Külot','S = 36 / M = 38 / L = 40   Sadelikteki güç…  Siyahın zamansızlığıyla her güne güçlü, kararlı ve şık başla.  İç giyimin olmazsa olmazı, ama sıradanlıktan çok uzak.','cat-kilot','col-gunluk',true,TRUE,TRUE,ARRAY['külot','günlük','premium'],NOW(),NOW()),
  ('prod-sx-03','murdum-gunluk-premium-kulot','Mürdüm Günlük Premium Külot','S = 36 / M = 38 / L = 40   Derin, gizemli ve sofistike.  Mürdüm tonu, gizli bir tutkuyu teninde taşır.  Her an giyilebilir ama her seferinde başka hissettirir.','cat-kilot','col-gunluk',true,TRUE,TRUE,ARRAY['külot','günlük','premium'],NOW(),NOW()),
  ('prod-sx-04','pudra-gunluk-premium-kulot','Pudra Günlük Premium Külot','S = 36 / M = 38 / L = 40   Nazik. Zarif. Ama asla sıradan değil.  Yumuşak pudra tonu, masumiyetin en dokunaklı halini sunar.  Sade şıklık, tenine her gün bir şiir gibi dokunur.','cat-kilot','col-gunluk',true,TRUE,TRUE,ARRAY['külot','günlük','premium'],NOW(),NOW()),
  ('prod-sx-05','ten-yuksek-bel-gunluk-premium-kulot','Ten Yüksek Bel Günlük Premium Külot','Görünmez gibi… ama etkisi unutulmaz.  Yüksek belin zarif kavrayışıyla, bedeninle uyum içinde bir kucaklaşma.  Günlük rahatlık, premium bir hisle birleşti.  Her sabah giydiğinde, gün seninle başlar.','cat-kilot','col-gunluk',true,TRUE,TRUE,ARRAY['külot','günlük','premium'],NOW(),NOW()),
  ('prod-sx-06','zincirli-siyah-x-tanga','Zincirli Siyah X Tanga','Tenine değdiği an, oyunun kuralları değişir.  Zincir detayıyla her adımın daha cesur, her bakışın daha uzun.  Bu parça, sessiz ama etkileyici bir başkaldırıdır.  Minimal değil, bilinçli bir kışkırtıcılık.  ✨ Sınır tanımayan kadınlar için.','cat-tanga','col-gunluk',true,TRUE,TRUE,ARRAY['tanga','premium'],NOW(),NOW()),
  ('prod-sx-07','mavi-temas','Mavi Temas','Gökyüzü kadar ferah, gece kadar derin…  Mavinin asaletiyle işlenmiş bir arzu.  Bakışta dinginlik, dokunuşta ihtiras saklı.    ✨ 599 TL ve üzeri siparişlerde kargo ücretsiz.     Ürün Özellikleri:      	 Rahat ve Destekleyici:  Yumuşak kaplar ve ayarlanabilir askılar, gün boyu rahatlık ve destek sağlar.  	 Kaliteli Malzeme:  %100 Pamuk, uzun ömürlü kullanım ve mükemmel uyum sunar.  	 Zarif Tasarım:  Dantel ve saten detaylar, ürünün şıklığını ve zarafetini ön plana çıkarır.      Sütyen Özellikleri:      	Destekleyici ve şekillendirici yumuşak kaplar  	Ayarlanabilir ve dayanıklı askılar  	Pratik kanca kapama sistemi  	Şık dantel ve saten detaylar      Külot Özellikleri:      	Esnek ve rahat bel bandı  	Yumuşak ve nefes alabilen kumaş  	Zarif dantel süslemeler  	Tam oturan ve rahat kesim      Malzeme:      	 %100 Pamuk','cat-takim','col-nokturn',false,TRUE,TRUE,ARRAY['takım','set','gece','dantel'],NOW(),NOW()),
  ('prod-sx-08','sirlar-gecesi','Sırlar Gecesi','Bazı geceler sadece yaşanır, anlatılamaz.  Siyahın asaletiyle işlenmiş transparan detaylar,  her bakışta yeni bir sır fısıldar.  Bu gece, sadece senin yazacağın bir hikâyeye ait.    ✨ 599 TL ve üzeri siparişlerde kargo ücretsiz.         Ürün Özellikleri:      	 Rahat ve Destekleyici:  Yumuşak kaplar ve ayarlanabilir askılar, gün boyu rahatlık ve destek sağlar.  	 Kaliteli Malzeme:  %100 Pamuk, uzun ömürlü kullanım ve mükemmel uyum sunar.  	 Zarif Tasarım:  Dantel ve saten detaylar, ürünün şıklığını ve zarafetini ön plana çıkarır.      Sütyen Özellikleri:      	Destekleyici ve şekillendirici yumuşak kaplar  	Ayarlanabilir ve dayanıklı askılar  	Pratik kanca kapama sistemi  	Şık dantel ve saten detaylar      Külot Özellikleri:      	Esnek ve rahat bel bandı  	Yumuşak ve nefes alabilen kumaş  	Zarif dantel süslemeler  	Tam oturan ve rahat kesim      Malzeme:      	 %100 Pamuk','cat-takim','col-nokturn',false,TRUE,TRUE,ARRAY['takım','set','gece','dantel'],NOW(),NOW()),
  ('prod-sx-09','zumrut-ten','Zümrüt Ten','Yeşilin en derin tonu, teninle buluşuyor.  Zümrüt gibi göz alıcı, dokunuş kadar değerli.  Sessiz bir çekicilik, dingin ama unutulmaz.  Teninde doğaya ait bir baştan çıkarıcı.    ✨ 599 TL ve üzeri siparişlerde kargo ücretsiz.         Ürün Özellikleri:      	 Rahat ve Destekleyici:  Yumuşak kaplar ve ayarlanabilir askılar, gün boyu rahatlık ve destek sağlar.  	 Kaliteli Malzeme:  %100 Pamuk, uzun ömürlü kullanım ve mükemmel uyum sunar.  	 Zarif Tasarım:  Dantel ve saten detaylar, ürünün şıklığını ve zarafetini ön plana çıkarır.      Sütyen Özellikleri:      	Destekleyici ve şekillendirici yumuşak kaplar  	Ayarlanabilir ve dayanıklı askılar  	Pratik kanca kapama sistemi  	Şık dantel ve saten detaylar      Külot Özellikleri:      	Esnek ve rahat bel bandı  	Yumuşak ve nefes alabilen kumaş  	Zarif dantel süslemeler  	Tam oturan ve rahat kesim      Malzeme:      	 %100 Pamuk','cat-takim','col-nokturn',false,TRUE,TRUE,ARRAY['takım','set','gece','dantel'],NOW(),NOW()),
  ('prod-sx-10','cilek-ruyasi','Çilek Rüyası','Tatlı bir düş gibi başlar.  Çilek tonlarının zarif çarpıcılığı, vücudu sararken  her detay gizli bir oyun başlatır.  Masum görünen bir rüyadır iz bırakır.    ✨ 599 TL ve üzeri siparişlerde kargo ücretsiz.         Ürün Özellikleri:      	 Rahat ve Destekleyici:  Yumuşak kaplar ve ayarlanabilir askılar, gün boyu rahatlık ve destek sağlar.  	 Kaliteli Malzeme:  %100 Pamuk, uzun ömürlü kullanım ve mükemmel uyum sunar.  	 Zarif Tasarım:  Dantel ve saten detaylar, ürünün şıklığını ve zarafetini ön plana çıkarır.      Sütyen Özellikleri:      	Destekleyici ve şekillendirici yumuşak kaplar  	Ayarlanabilir ve dayanıklı askılar  	Pratik kanca kapama sistemi  	Şık dantel ve saten detaylar      Külot Özellikleri:      	Esnek ve rahat bel bandı  	Yumuşak ve nefes alabilen kumaş  	Zarif dantel süslemeler  	Tam oturan ve rahat kesim      Malzeme:      	 %100 Pamuk','cat-takim','col-nokturn',false,TRUE,TRUE,ARRAY['takım','set','gece','dantel'],NOW(),NOW()),
  ('prod-sx-11','pembe-tutku','Pembe Tutku','Tenine değdiği anda başlar...  Pembe hiç bu kadar arzulu olmamıştı.  Dokunuşu bile yeter.  ✨ 599 TL ve üzeri siparişlerde kargo ücretsiz.         Ürün Özellikleri:      	 Rahat ve Destekleyici:  Yumuşak kaplar ve ayarlanabilir askılar, gün boyu rahatlık ve destek sağlar.  	 Kaliteli Malzeme:  %100 Pamuk, uzun ömürlü kullanım ve mükemmel uyum sunar.  	 Zarif Tasarım:  Dantel ve saten detaylar, ürünün şıklığını ve zarafetini ön plana çıkarır.      Sütyen Özellikleri:      	Destekleyici ve şekillendirici yumuşak kaplar  	Ayarlanabilir ve dayanıklı askılar  	Pratik kanca kapama sistemi  	Şık dantel ve saten detaylar      Külot Özellikleri:      	Esnek ve rahat bel bandı  	Yumuşak ve nefes alabilen kumaş  	Zarif dantel süslemeler  	Tam oturan ve rahat kesim      Malzeme:      	 %100 Pamuk','cat-takim','col-nokturn',false,TRUE,TRUE,ARRAY['takım','set','gece','dantel'],NOW(),NOW()),
  ('prod-sx-12','citir-papatya','Çıtır Papatya','Zarif bir dokunuş, taze bir his.  Papatya gibi masum, çiçek gibi baştan çıkarıcı.  Hafif, doğal, unutulmaz.    ✨ 599 TL ve üzeri siparişlerde kargo ücretsiz.         Ürün Özellikleri:      	 Rahat ve Destekleyici:  Yumuşak kaplar ve ayarlanabilir askılar, gün boyu rahatlık ve destek sağlar.  	 Kaliteli Malzeme:  %100 Pamuk, uzun ömürlü kullanım ve mükemmel uyum sunar.  	 Zarif Tasarım:  Dantel ve saten detaylar, ürünün şıklığını ve zarafetini ön plana çıkarır.      Sütyen Özellikleri:      	Destekleyici ve şekillendirici yumuşak kaplar  	Ayarlanabilir ve dayanıklı askılar  	Pratik kanca kapama sistemi  	Şık dantel ve saten detaylar      Külot Özellikleri:      	Esnek ve rahat bel bandı  	Yumuşak ve nefes alabilen kumaş  	Zarif dantel süslemeler  	Tam oturan ve rahat kesim      Malzeme:      	 %100 Pamuk','cat-takim','col-nokturn',false,TRUE,TRUE,ARRAY['takım','set','gece','dantel'],NOW(),NOW()),
  ('prod-sx-13','ask-fisiltisi','Aşk Fısıltısı','Hiçbir kelimeye ihtiyaç duymayan bir temas.  İnce dantelin, zarif transparanlığın bedenle kurduğu o ilk bağ…  Her detay seni fısıltı gibi saran bir tutkuyu anlatıyor.  Bu takım, aşkın en yalın, en çarpıcı hâli.    ✨ 599 TL ve üzeri siparişlerde kargo ücretsiz.  Bir bakış. Bir dokunuş. Bir fısıltı yeter.         Ürün Özellikleri:      	 Rahat ve Destekleyici:  Yumuşak kaplar ve ayarlanabilir askılar, gün boyu rahatlık ve destek sağlar.  	 Kaliteli Malzeme:  %100 Pamuk, uzun ömürlü kullanım ve mükemmel uyum sunar.  	 Zarif Tasarım:  Dantel ve saten detaylar, ürünün şıklığını ve zarafetini ön plana çıkarır.      Sütyen Özellikleri:      	Destekleyici ve şekillendirici yumuşak kaplar  	Ayarlanabilir ve dayanıklı askılar  	Pratik kanca kapama sistemi  	Şık dantel ve saten detaylar      Külot Özellikleri:      	Esnek ve rahat bel bandı  	Yumuşak ve nefes alabilen kumaş  	Zarif dantel süslemeler  	Tam oturan ve rahat kesim      Malzeme:      	 %100 Pamuk','cat-takim','col-nokturn',false,TRUE,TRUE,ARRAY['takım','set','gece','dantel'],NOW(),NOW()),
  ('prod-sx-14','golge-oyunu','Gölge Oyunu','Gecenin nerede başladığı belli… ama nerede biteceğini kimse bilmiyor.  Siyahın asaleti ve transparan dokunun cazibesi bu takımda buluştu.  İz bırakan bir dokunuş, karanlıkta kaybolmayan bir silüet.  Gece uzun... ama seninle sonsuz.    ✨ 599 TL ve üzeri siparişlerde kargo ücretsiz.  Sonsuz Gece başlıyor. Işığa gerek yok.         Ürün Özellikleri:      	 Rahat ve Destekleyici:  Yumuşak kaplar ve ayarlanabilir askılar, gün boyu rahatlık ve destek sağlar.  	 Kaliteli Malzeme:  %100 Pamuk, uzun ömürlü kullanım ve mükemmel uyum sunar.  	 Zarif Tasarım:  Dantel ve saten detaylar, ürünün şıklığını ve zarafetini ön plana çıkarır.      Sütyen Özellikleri:      	Destekleyici ve şekillendirici yumuşak kaplar  	Ayarlanabilir ve dayanıklı askılar  	Pratik kanca kapama sistemi  	Şık dantel ve saten detaylar      Külot Özellikleri:      	Esnek ve rahat bel bandı  	Yumuşak ve nefes alabilen kumaş  	Zarif dantel süslemeler  	Tam oturan ve rahat kesim      Malzeme:      	 %100 Pamuk','cat-takim','col-nokturn',false,TRUE,TRUE,ARRAY['takım','set','gece','dantel'],NOW(),NOW()),
  ('prod-sx-15','kirmiziya-davet','Kırmızıya Davet','Teninin üstünde gezinen dantel, arzuya açılan bir kapı.  Bu sadece bir iç çamaşırı değil, bir baştan çıkarma ritüeli.  Transparan her çizgi, bir davetin başlangıcı.    ✨ 599 TL ve üzeri siparişlerde kargo ücretsiz.  Kırmızı konuşur, sen hissettirirsin.         Ürün Özellikleri:      	 Rahat ve Destekleyici:  Yumuşak kaplar ve ayarlanabilir askılar, gün boyu rahatlık ve destek sağlar.  	 Kaliteli Malzeme:  %100 Pamuk, uzun ömürlü kullanım ve mükemmel uyum sunar.  	 Zarif Tasarım:  Dantel ve saten detaylar, ürünün şıklığını ve zarafetini ön plana çıkarır.      Sütyen Özellikleri:      	Destekleyici ve şekillendirici yumuşak kaplar  	Ayarlanabilir ve dayanıklı askılar  	Pratik kanca kapama sistemi  	Şık dantel ve saten detaylar      Külot Özellikleri:      	Esnek ve rahat bel bandı  	Yumuşak ve nefes alabilen kumaş  	Zarif dantel süslemeler  	Tam oturan ve rahat kesim      Malzeme:      	 %100 Pamuk','cat-takim','col-nokturn',false,TRUE,TRUE,ARRAY['takım','set','gece','dantel'],NOW(),NOW()),
  ('prod-sx-16','sonsuz-arzu','Sonsuz Arzu','Sınır tanımayan bir özgüven.    Transparan detaylarıyla bedeni saran bu korse takımı, siyahın etkileyiciliğini baştan çıkarıcılıkla buluşturuyor.  Kıvrımlarına dokunan güçlü tasarımıyla, her bakışa karşılık verir.  Görünmek değil, iz bırakmak isteyen kadınlar için tasarlandı.    ✨ 599 TL ve üzeri siparişlerde kargo ücretsiz.           Ürün Özellikleri:      	 Rahat ve Destekleyici:  Yumuşak kaplar ve ayarlanabilir askılar, gün boyu rahatlık ve destek sağlar.  	 Kaliteli Malzeme:  %100 Pamuk, uzun ömürlü kullanım ve mükemmel uyum sunar.  	 Zarif Tasarım:  Dantel ve saten detaylar, ürünün şıklığını ve zarafetini ön plana çıkarır.      Sütyen Özellikleri:      	Destekleyici ve şekillendirici yumuşak kaplar  	Ayarlanabilir ve dayanıklı askılar  	Pratik kanca kapama sistemi  	Şık dantel ve saten detaylar      Külot Özellikleri:      	Esnek ve rahat bel bandı  	Yumuşak ve nefes alabilen kumaş  	Zarif dantel süslemeler  	Tam oturan ve rahat kesim      Malzeme:      	 %100 Pamuk','cat-korse','col-nokturn',false,TRUE,TRUE,ARRAY['korse','gece','transparan'],NOW(),NOW()),
  ('prod-sx-17','siyah-gunluk-premium-kulot-3-lu-set','Siyah Günlük Premium Külot 3''LÜ SET','S = 36 / M = 38 / L = 40   Bu set içerisinde 3 adet ScarletX siyah premium külot bulunmaktadır.','cat-kilot','col-gunluk',false,TRUE,TRUE,ARRAY['külot','günlük','premium'],NOW(),NOW()),
  ('prod-sx-18','renkli-gunluk-premium-kulot-3-lu-set','Renkli Günlük Premium Külot 3''LÜ SET','S = 36 / M = 38 / L = 40   Bu set içerisinde birer adet ScarletX mürdüm, lacivert ve pudra premium külot bulunmaktadır.','cat-kilot','col-gunluk',false,TRUE,TRUE,ARRAY['külot','günlük','premium'],NOW(),NOW())
ON CONFLICT ("slug") DO NOTHING;

-- ─── Ürün Varyantları ────────────────────────────────────────────────────────
INSERT INTO "product_variants" ("id","productId","sku","size","color","colorHex","price","compareAtPrice","stock","images","isActive","createdAt","updatedAt") VALUES
  ('prod-sx-01-v1','prod-sx-01','SX-LACIVE-S-1','S','Lacivert','#1E3A5F',299,NULL,100,ARRAY[]::TEXT[],TRUE,NOW(),NOW()),
  ('prod-sx-01-v2','prod-sx-01','SX-LACIVE-M-1','M','Lacivert','#1E3A5F',299,NULL,100,ARRAY[]::TEXT[],TRUE,NOW(),NOW()),
  ('prod-sx-01-v3','prod-sx-01','SX-LACIVE-L-1','L','Lacivert','#1E3A5F',299,NULL,100,ARRAY[]::TEXT[],TRUE,NOW(),NOW()),
  ('prod-sx-02-v1','prod-sx-02','SX-SIYAH-S-2','S','Siyah','#1A1A1A',299,NULL,100,ARRAY[]::TEXT[],TRUE,NOW(),NOW()),
  ('prod-sx-02-v2','prod-sx-02','SX-SIYAH-M-2','M','Siyah','#1A1A1A',299,NULL,100,ARRAY[]::TEXT[],TRUE,NOW(),NOW()),
  ('prod-sx-02-v3','prod-sx-02','SX-SIYAH-L-2','L','Siyah','#1A1A1A',299,NULL,100,ARRAY[]::TEXT[],TRUE,NOW(),NOW()),
  ('prod-sx-03-v1','prod-sx-03','SX-MURDUM-S-3','S','Mürdüm','#6B2C4A',299,NULL,100,ARRAY[]::TEXT[],TRUE,NOW(),NOW()),
  ('prod-sx-03-v2','prod-sx-03','SX-MURDUM-M-3','M','Mürdüm','#6B2C4A',299,NULL,100,ARRAY[]::TEXT[],TRUE,NOW(),NOW()),
  ('prod-sx-03-v3','prod-sx-03','SX-MURDUM-L-3','L','Mürdüm','#6B2C4A',299,NULL,100,ARRAY[]::TEXT[],TRUE,NOW(),NOW()),
  ('prod-sx-04-v1','prod-sx-04','SX-PUDRA-S-4','S','Pudra','#E8C4B8',199,299,100,ARRAY[]::TEXT[],TRUE,NOW(),NOW()),
  ('prod-sx-04-v2','prod-sx-04','SX-PUDRA-M-4','M','Pudra','#E8C4B8',199,299,100,ARRAY[]::TEXT[],TRUE,NOW(),NOW()),
  ('prod-sx-04-v3','prod-sx-04','SX-PUDRA-L-4','L','Pudra','#E8C4B8',199,299,100,ARRAY[]::TEXT[],TRUE,NOW(),NOW()),
  ('prod-sx-05-v1','prod-sx-05','SX-TENYU-OS-5','Tek Ebat','Ten','#D4A896',399,NULL,100,ARRAY[]::TEXT[],TRUE,NOW(),NOW()),
  ('prod-sx-06-v1','prod-sx-06','SX-ZINCIR-OS-6','Tek Ebat','Siyah','#1A1A1A',499,NULL,100,ARRAY[]::TEXT[],TRUE,NOW(),NOW()),
  ('prod-sx-07-v1','prod-sx-07','SX-MAVIT-XS-7','XS','Mavi','#3B7FC0',799,1200,100,ARRAY[]::TEXT[],TRUE,NOW(),NOW()),
  ('prod-sx-07-v2','prod-sx-07','SX-MAVIT-S-7','S','Mavi','#3B7FC0',799,1200,99,ARRAY[]::TEXT[],TRUE,NOW(),NOW()),
  ('prod-sx-07-v3','prod-sx-07','SX-MAVIT-M-7','M','Mavi','#3B7FC0',799,1200,100,ARRAY[]::TEXT[],TRUE,NOW(),NOW()),
  ('prod-sx-07-v4','prod-sx-07','SX-MAVIT-L-7','L','Mavi','#3B7FC0',799,1200,100,ARRAY[]::TEXT[],TRUE,NOW(),NOW()),
  ('prod-sx-08-v1','prod-sx-08','SX-SIRLAR-XS-8','XS','Siyah','#1A1A1A',799,1200,100,ARRAY[]::TEXT[],TRUE,NOW(),NOW()),
  ('prod-sx-08-v2','prod-sx-08','SX-SIRLAR-S-8','S','Siyah','#1A1A1A',799,1200,99,ARRAY[]::TEXT[],TRUE,NOW(),NOW()),
  ('prod-sx-08-v3','prod-sx-08','SX-SIRLAR-M-8','M','Siyah','#1A1A1A',799,1200,100,ARRAY[]::TEXT[],TRUE,NOW(),NOW()),
  ('prod-sx-08-v4','prod-sx-08','SX-SIRLAR-L-8','L','Siyah','#1A1A1A',799,1200,100,ARRAY[]::TEXT[],TRUE,NOW(),NOW()),
  ('prod-sx-09-v1','prod-sx-09','SX-ZUMRUT-XS-9','XS','Ten','#D4A896',799,1200,100,ARRAY[]::TEXT[],TRUE,NOW(),NOW()),
  ('prod-sx-09-v2','prod-sx-09','SX-ZUMRUT-S-9','S','Ten','#D4A896',799,1200,100,ARRAY[]::TEXT[],TRUE,NOW(),NOW()),
  ('prod-sx-09-v3','prod-sx-09','SX-ZUMRUT-M-9','M','Ten','#D4A896',799,1200,100,ARRAY[]::TEXT[],TRUE,NOW(),NOW()),
  ('prod-sx-09-v4','prod-sx-09','SX-ZUMRUT-L-9','L','Ten','#D4A896',799,1200,100,ARRAY[]::TEXT[],TRUE,NOW(),NOW()),
  ('prod-sx-10-v1','prod-sx-10','SX-CILEK-XS-10','XS','Çilek','#E8325B',799,1200,100,ARRAY[]::TEXT[],TRUE,NOW(),NOW()),
  ('prod-sx-10-v2','prod-sx-10','SX-CILEK-S-10','S','Çilek','#E8325B',799,1200,100,ARRAY[]::TEXT[],TRUE,NOW(),NOW()),
  ('prod-sx-10-v3','prod-sx-10','SX-CILEK-M-10','M','Çilek','#E8325B',799,1200,100,ARRAY[]::TEXT[],TRUE,NOW(),NOW()),
  ('prod-sx-10-v4','prod-sx-10','SX-CILEK-L-10','L','Çilek','#E8325B',799,1200,100,ARRAY[]::TEXT[],TRUE,NOW(),NOW()),
  ('prod-sx-11-v1','prod-sx-11','SX-PEMBE-XS-11','XS','Pembe','#EC4899',799,1200,100,ARRAY[]::TEXT[],TRUE,NOW(),NOW()),
  ('prod-sx-11-v2','prod-sx-11','SX-PEMBE-S-11','S','Pembe','#EC4899',799,1200,100,ARRAY[]::TEXT[],TRUE,NOW(),NOW()),
  ('prod-sx-11-v3','prod-sx-11','SX-PEMBE-M-11','M','Pembe','#EC4899',799,1200,100,ARRAY[]::TEXT[],TRUE,NOW(),NOW()),
  ('prod-sx-11-v4','prod-sx-11','SX-PEMBE-L-11','L','Pembe','#EC4899',799,1200,100,ARRAY[]::TEXT[],TRUE,NOW(),NOW()),
  ('prod-sx-12-v1','prod-sx-12','SX-CITIR-XS-12','XS','Krem','#FAF7F2',799,1200,100,ARRAY[]::TEXT[],TRUE,NOW(),NOW()),
  ('prod-sx-12-v2','prod-sx-12','SX-CITIR-S-12','S','Krem','#FAF7F2',799,1200,99,ARRAY[]::TEXT[],TRUE,NOW(),NOW()),
  ('prod-sx-12-v3','prod-sx-12','SX-CITIR-M-12','M','Krem','#FAF7F2',799,1200,100,ARRAY[]::TEXT[],TRUE,NOW(),NOW()),
  ('prod-sx-12-v4','prod-sx-12','SX-CITIR-L-12','L','Krem','#FAF7F2',799,1200,100,ARRAY[]::TEXT[],TRUE,NOW(),NOW()),
  ('prod-sx-13-v1','prod-sx-13','SX-ASKFI-OS-13','Tek Ebat','Siyah','#1A1A1A',799,1200,400,ARRAY[]::TEXT[],TRUE,NOW(),NOW()),
  ('prod-sx-14-v1','prod-sx-14','SX-GOLGE-XS-14','XS','Siyah','#1A1A1A',799,1200,100,ARRAY[]::TEXT[],TRUE,NOW(),NOW()),
  ('prod-sx-14-v2','prod-sx-14','SX-GOLGE-S-14','S','Siyah','#1A1A1A',799,1200,100,ARRAY[]::TEXT[],TRUE,NOW(),NOW()),
  ('prod-sx-14-v3','prod-sx-14','SX-GOLGE-M-14','M','Siyah','#1A1A1A',799,1200,100,ARRAY[]::TEXT[],TRUE,NOW(),NOW()),
  ('prod-sx-14-v4','prod-sx-14','SX-GOLGE-L-14','L','Siyah','#1A1A1A',799,1200,100,ARRAY[]::TEXT[],TRUE,NOW(),NOW()),
  ('prod-sx-15-v1','prod-sx-15','SX-KIRMIZ-XS-15','XS','Kırmızı','#8B0000',799,1200,100,ARRAY[]::TEXT[],TRUE,NOW(),NOW()),
  ('prod-sx-15-v2','prod-sx-15','SX-KIRMIZ-S-15','S','Kırmızı','#8B0000',799,1200,100,ARRAY[]::TEXT[],TRUE,NOW(),NOW()),
  ('prod-sx-15-v3','prod-sx-15','SX-KIRMIZ-M-15','M','Kırmızı','#8B0000',799,1200,100,ARRAY[]::TEXT[],TRUE,NOW(),NOW()),
  ('prod-sx-15-v4','prod-sx-15','SX-KIRMIZ-L-15','L','Kırmızı','#8B0000',799,1200,99,ARRAY[]::TEXT[],TRUE,NOW(),NOW()),
  ('prod-sx-16-v1','prod-sx-16','SX-SONSUZ-XS-16','XS','Siyah','#1A1A1A',799,1200,100,ARRAY[]::TEXT[],TRUE,NOW(),NOW()),
  ('prod-sx-16-v2','prod-sx-16','SX-SONSUZ-S-16','S','Siyah','#1A1A1A',799,1200,100,ARRAY[]::TEXT[],TRUE,NOW(),NOW()),
  ('prod-sx-16-v3','prod-sx-16','SX-SONSUZ-M-16','M','Siyah','#1A1A1A',799,1200,100,ARRAY[]::TEXT[],TRUE,NOW(),NOW()),
  ('prod-sx-16-v4','prod-sx-16','SX-SONSUZ-L-16','L','Siyah','#1A1A1A',799,1200,100,ARRAY[]::TEXT[],TRUE,NOW(),NOW()),
  ('prod-sx-17-v1','prod-sx-17','SX-SIYAH-S-17','S','Siyah','#1A1A1A',499,NULL,100,ARRAY[]::TEXT[],TRUE,NOW(),NOW()),
  ('prod-sx-17-v2','prod-sx-17','SX-SIYAH-M-17','M','Siyah','#1A1A1A',499,NULL,100,ARRAY[]::TEXT[],TRUE,NOW(),NOW()),
  ('prod-sx-17-v3','prod-sx-17','SX-SIYAH-L-17','L','Siyah','#1A1A1A',499,NULL,100,ARRAY[]::TEXT[],TRUE,NOW(),NOW()),
  ('prod-sx-18-v1','prod-sx-18','SX-RENKLI-S-18','S','Çok Renkli','#C9A96E',499,NULL,100,ARRAY[]::TEXT[],TRUE,NOW(),NOW()),
  ('prod-sx-18-v2','prod-sx-18','SX-RENKLI-M-18','M','Çok Renkli','#C9A96E',499,NULL,100,ARRAY[]::TEXT[],TRUE,NOW(),NOW()),
  ('prod-sx-18-v3','prod-sx-18','SX-RENKLI-L-18','L','Çok Renkli','#C9A96E',499,NULL,100,ARRAY[]::TEXT[],TRUE,NOW(),NOW())
ON CONFLICT ("sku") DO NOTHING;

-- ─── Kuponlar ────────────────────────────────────────────────────────────────
INSERT INTO "coupons" ("id","code","type","value","minOrderAmount","isFirstOrderOnly","isActive","createdAt","updatedAt") VALUES
  ('cpn-001','SCARLET10','PERCENTAGE',10,500,FALSE,TRUE,NOW(),NOW()),
  ('cpn-002','ILKALIM','FIXED',150,NULL,TRUE,TRUE,NOW(),NOW()),
  ('cpn-003','HOSGELDIN','FIXED',200,1000,TRUE,TRUE,NOW(),NOW())
ON CONFLICT ("code") DO NOTHING;

-- ─── Duyuru Çubuğu ──────────────────────────────────────────────────────────
INSERT INTO "announcement_bars" ("id","text","link","bgColor","textColor","isActive","order","createdAt","updatedAt") VALUES
  ('ann-001','🚚 500 TL ve üzeri alışverişlerinizde ücretsiz kargo','/koleksiyonlar','#1A1A1A','#C9A96E',TRUE,1,NOW(),NOW())
ON CONFLICT DO NOTHING;