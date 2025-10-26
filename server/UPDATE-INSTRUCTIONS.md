# 🔄 Çoklu Yorum Sistemi - Güncelleme Rehberi

## ✅ Yapılan Değişiklikler

### 1. Database Model Güncellendi
- ✅ `reviewText` → `reviewTexts` (array)
- ✅ `maxReviews` field'ı eklendi (1-3 arası)

### 2. Yeni Özellikler
- ✅ Her oyun için 1-3 yorum eklenebilir
- ✅ Kullanıcı bulamazsa sonraki yorumu görebilir
- ✅ Her yeni yorum için -25 puan kesinti
- ✅ Admin panelde birden fazla yorum ekleme

## 🔄 Mevcut Verileri Güncelleme (Migration)

### Adım 1: Serverleri Durdur
```powershell
# Terminal'de Ctrl + C
```

### Adım 2: Mevcut Verileri Migrate Et
```powershell
cd server
node migrateReviews.js
```

### Göreceğin Çıktı:
```
✅ Connected to MongoDB
📝 Found 15 reviews to migrate
   ✓ Migrated: Factorio
   ✓ Migrated: Stardew Valley
   ...
✅ Migration completed successfully!
```

### Adım 3: Serverleri Tekrar Başlat
```powershell
cd ..
npm run dev
```

## 📝 Admin Panelde Yeni Yorum Ekleme

### Yöntem 1: Yeni Oyun Eklerken (3 Yorum Birden)

1. Admin Panel → "+ Add New Review"
2. **Game Name**: `Elden Ring`
3. **Review 1** (zorunlu):
```
I died 500 times to the first boss and I still think it's too easy.
```
4. **Review 2** (opsiyonel):
```
This game makes Dark Souls look like a tutorial for toddlers.
```
5. **Review 3** (opsiyonel):
```
My controller has trust issues now. 10/10 would get destroyed again.
```

### Yöntem 2: Mevcut Oyuna Yorum Ekleme

1. Admin Panel → Oyunu bul → "Edit"
2. Mevcut yorumları gör
3. "+ Add Another Review" butonu (yakında eklenecek)
4. Yeni yorum ekle
5. Save

## 🎮 Oynanış Nasıl Değişti?

### Kullanıcı Deneyimi:

1. **İlk Yorum** gösterilir
2. Kullanıcı tahmin eder
3. Bulamazsa:
   - **"Show Next Review (-25 pts)"** butonuna tıklar
   - 2. yorum gösterilir
   - Puan 25 azalır
4. Yine bulamazsa:
   - 3. yorumu görebilir
   - Tekrar -25 puan

### Puan Sistemi:

```
İlk yorumda doğru: +100 puan
İkinci yorumda doğru: +75 puan (-25 kesinti)
Üçüncü yorumda doğru: +50 puan (-50 kesinti)
```

Plus streak bonusu hala geçerli!

## 🔧 Sorun Giderme

### Hata: "reviewTexts is not iterable"
**Çözüm**: Migration script'i çalıştır
```powershell
cd server
node migrateReviews.js
```

### Admin panelde eskiler görünüyor
**Çözüm**: Sayfayı refresh et (F5)

### Yeni yorumlar gösterilmiyor
**Çözüm**: 
1. Backend'i restart et
2. Browser cache temizle (Ctrl + Shift + R)

## 📊 Örnek Çoklu Yorum Setleri

### Minecraft
```json
{
  "reviewTexts": [
    "I punch tree, I get wood. 300 hours later I have a castle.",
    "Started in survival, ended up building a working computer with redstone.",
    "My 8-year-old nephew teaches ME how to play. I'm 32."
  ],
  "gameName": "Minecraft",
  "genre": "Sandbox"
}
```

### Dark Souls
```json
{
  "reviewTexts": [
    "Died to the first boss 47 times. Finally beat it. Died to a regular enemy 2 minutes later.",
    "This game taught me patience, persistence, and how to throw a controller without breaking it.",
    "Git Gud: The Game. 10/10 would rage quit again."
  ],
  "gameName": "Dark Souls",
  "genre": "Action RPG"
}
```

### Among Us
```json
{
  "reviewTexts": [
    "Friendship destroyer simulator. Lost 3 friends, gained trust issues.",
    "I'm not saying I'm good at lying, but I got voted out as a crewmate for being 'too sus'.",
    "Red sus. Blue sus. Everyone sus. I have no friends anymore."
  ],
  "gameName": "Among Us",
  "genre": "Social Deduction"
}
```

## ✅ Migration Checklist

- [ ] Serverleri durdur
- [ ] `node migrateReviews.js` çalıştır
- [ ] Migration başarılı oldu mu kontrol et
- [ ] Serverleri tekrar başlat
- [ ] Bir oyun test et (Free Play)
- [ ] "Show Next Review" butonu görünüyor mu?
- [ ] Admin panelde yeni oyun ekle (3 yorumla)
- [ ] Yeni eklenen oyunu test et

## 🎯 Önerilen İyileştirmeler

1. **Admin Panel**: Textarea'lar ayrı ayrı ekle
2. **UI**: Yorum sayacı ekle (1/3, 2/3)
3. **Stats**: Kaç yorumda doğru bulundu tracking
4. **Difficulty**: Yorum sayısına göre otomatik difficulty

---

**Sorular?** Hata alırsan tam hata mesajını göster! 🚀

