# Cinema Seat Booking · رزرو صندلی سینما

A modern, bilingual (Persian/English) movie seat booking UI. Rebuilt from a
static seat-picker demo into a small interactive app suitable for a portfolio
or job-application sample.

یک رابط رزرو صندلی سینما با طراحی مدرن و دوزبانه (فارسی/انگلیسی). این پروژه از
یک نمونه‌ی استاتیک انتخاب صندلی، به یک اپلیکیشن کوچک و کاربردی تبدیل شده که
برای نمونه‌کار یا رزومه مناسب است.

## Features / امکانات

- Pick a movie — each has its own price and its own occupied-seat map, like a
  real showtime / انتخاب فیلم با قیمت و نقشه صندلی‌های پرشده‌ی مخصوص به خودش
- Select/deselect available seats, occupied seats can't be picked / انتخاب و
  لغو انتخاب صندلی، عدم امکان انتخاب صندلی‌های پرشده
- Live seat count & total price / نمایش زنده تعداد صندلی و مبلغ کل
- Confirm booking with a summary modal / تایید رزرو با نمایش خلاصه در یک پنجره
- Full Persian (RTL) / English (LTR) language toggle / سوییچ کامل بین فارسی و
  انگلیسی
- Selections, movie, and language persist on refresh via `localStorage` /
  ذخیره انتخاب‌ها، فیلم و زبان در مرورگر برای بازگشت بعد از رفرش
- Large, touch-friendly seat targets for mobile / صندلی‌های بزرگ‌تر و مناسب لمس
  در موبایل

## Files

- `index.html` — markup shell (movie list & seat map are rendered by JS)
- `style.css` — design tokens, layout, RTL-aware styling
- `script.js` — movie data, translations dictionary, rendering, state & events

## Notes for extending it

- Add more movies/showtimes in the `movies` array in `script.js`
- Add more UI strings by adding a key to both `fa` and `en` in `translations`
  and a matching `data-i18n="key"` attribute in the HTML
