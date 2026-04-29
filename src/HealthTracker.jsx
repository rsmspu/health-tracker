import React, { useState, useEffect, useMemo } from "react";
import { Pill, Droplet, Dumbbell, Apple, Scale, MessageCircle, RefreshCw, Check, Sparkles, Sun, Moon, Coffee, Share2, Heart } from "lucide-react";

// ============================================================
// MEAL DATABASE — pulled from Vaishnavi's two diet PDFs
// (Eggetarian + Vegetarian South Indian, 1600 kcal, 60-68g protein)
// ============================================================

const MEALS = {
  earlyMorning: [
    { name: "Soaked fenugreek water", detail: "1 tsp methi seeds soaked overnight in 200ml water", veggies: [], type: "drink" },
    { name: "Warm lemon honey water", detail: "200ml warm water + lemon drops + 1 tsp honey", veggies: [], type: "drink" },
    { name: "Jeera–coriander water", detail: "1 tsp each of jeera + coriander boiled in 250ml → 200ml", veggies: [], type: "drink" },
    { name: "Amla turmeric shot", detail: "1 amla + pinch turmeric + 10 curry leaves, blended in 150ml water", veggies: ["curry leaves"], type: "drink" },
    { name: "Coriander cumin water + soaked nuts", detail: "150ml jeera-dhania water + 3-4 soaked almonds + 2 walnuts", veggies: [], type: "drink" },
  ],
  breakfast: [
    { name: "Boiled eggs + Green smoothie", detail: "2 boiled eggs + 200ml smoothie (spinach, cucumber, green apple, chia, flax)", veggies: ["spinach", "cucumber"], protein: 18, type: "egg" },
    { name: "Egg sandwich + tomato-mint juice", detail: "Wholegrain bread, 2 eggs, 50g veggies (cucumber/tomato/onion/carrot) + 150ml juice", veggies: ["tomato", "cucumber", "onion", "carrot"], protein: 16, type: "egg" },
    { name: "Yogurt bowl + berries + chickpeas", detail: "70g curd + 100g berries + 100g boiled chickpeas + pumpkin/flax seeds", veggies: [], protein: 14, type: "veg" },
    { name: "Chia seed pudding + fruit + nuts", detail: "100g overnight chia pudding + 50g seasonal fruit + 10g mixed nuts", veggies: [], protein: 8, type: "veg" },
    { name: "Oats berry smoothie + green gram", detail: "200ml smoothie (oats, berries, chia, greek yogurt) + 100g boiled green gram", veggies: [], protein: 15, type: "veg" },
    { name: "Idli + sambar", detail: "3 idlis + 100g sambar + chutney (mint/coriander) + 100g salad", veggies: ["tomato", "onion", "drumstick"], protein: 10, type: "veg" },
    { name: "Oats jowar dosa + chutney", detail: "1 medium dosa with 50g grated paneer + chutney + 120g salad with sprouts", veggies: ["onion", "tomato"], protein: 14, type: "veg" },
    { name: "Vegetable green peas upma", detail: "120g upma + 100g cucumber slices", veggies: ["green peas", "carrot", "onion", "cucumber"], protein: 8, type: "veg" },
    { name: "Paneer poha", detail: "120g poha with 50g paneer + 100g cucumber-carrot slices", veggies: ["onion", "carrot", "cucumber", "green peas"], protein: 14, type: "veg" },
    { name: "Paneer pesarattu", detail: "2 medium pesarattu with grated paneer + tomato-coriander chutney + 100g salad", veggies: ["tomato", "onion"], protein: 16, type: "veg" },
    { name: "Avocado toast + sprouts", detail: "2 multigrain toast with avocado + 80g boiled sprouts/chana", veggies: ["avocado"], protein: 14, type: "veg" },
    { name: "Hormone balance smoothie", detail: "150ml almond milk + ½ banana + seed mix + soaked nuts + chia + cinnamon", veggies: [], protein: 10, type: "veg" },
  ],
  midMorning: [
    { name: "Masala buttermilk", detail: "200ml buttermilk + curry leaves + jeera + ginger", veggies: ["curry leaves", "ginger"], type: "snack" },
    { name: "Carrot-cucumber + hummus", detail: "70g sliced veggies + 1 tbsp hummus", veggies: ["carrot", "cucumber"], type: "snack" },
    { name: "Seasonal fruit", detail: "100g — apple/guava/orange/pear/pomegranate", veggies: [], type: "snack" },
    { name: "Roasted makhana", detail: "30g lightly roasted makhana", veggies: [], type: "snack" },
    { name: "Tender coconut water", detail: "150ml fresh", veggies: [], type: "snack" },
    { name: "Chia seeds water", detail: "1 tsp chia soaked overnight in 250ml water", veggies: [], type: "snack" },
  ],
  lunch: [
    { name: "Rice + green gram sprouts + sautéed veggies", detail: "120g rice + 100g sprouts + 100g sautéed veggies (minimal oil)", veggies: ["any seasonal"], protein: 14, type: "veg" },
    { name: "Paneer chapati + mixed veg curry", detail: "2 paneer-stuffed chapatis (50g paneer) + 120g curry + 150g cucumber-carrot", veggies: ["mixed", "cucumber", "carrot"], protein: 18, type: "veg" },
    { name: "Quinoa veg upma + dal soup", detail: "120g quinoa upma (50g veggies) + 200ml thick dal soup + 100g carrot slices", veggies: ["green peas", "carrot", "onion"], protein: 16, type: "veg" },
    { name: "Veg biryani + rajma + raita", detail: "150g biryani + 150g rajma + 10g curd raita + 100g stir fry", veggies: ["mixed"], protein: 20, type: "veg" },
    { name: "Rice + ladies finger curry + chana", detail: "120g rice + ladies finger curry + 100g beans poriyal + 100g boiled chole (or 2 boiled eggs)", veggies: ["okra", "beans"], protein: 18, type: "egg" },
    { name: "Drumsticks dal + rice + curd", detail: "120g rice + 120g drumstick leaves dal + 100g curry + 60g curd + 100g salad", veggies: ["drumstick leaves", "any leafy"], protein: 16, type: "veg" },
    { name: "Rajma rice + buttermilk", detail: "120g rice + 120g rajma gravy + 150ml buttermilk + cucumber slices", veggies: ["onion", "tomato", "cucumber"], protein: 17, type: "veg" },
    { name: "Paneer fried rice", detail: "150g paneer fried rice (70g paneer) + buttermilk + 100g salad", veggies: ["capsicum", "carrot", "spring onion"], protein: 22, type: "veg" },
    { name: "Moong dal khichdi", detail: "150g khichdi (can use foxtail millet) + 150g salad + 150ml buttermilk", veggies: ["carrot", "beans", "green peas"], protein: 14, type: "veg" },
    { name: "Paneer paratha + buttermilk", detail: "2 paneer parathas + 150ml buttermilk + 150g salad", veggies: ["onion", "coriander"], protein: 18, type: "veg" },
    { name: "Vegetable paneer pulao", detail: "150g pulao + 150g salad + 150ml buttermilk", veggies: ["mixed", "green peas"], protein: 16, type: "veg" },
    { name: "Quinoa + spinach dal", detail: "120g cooked quinoa + 100g palak/methi/amaranth dal + 150ml buttermilk + salad", veggies: ["spinach", "methi", "amaranth"], protein: 18, type: "veg" },
    { name: "Ragi/Jowar roti + cauliflower curry", detail: "2 millet rotis + 100g cauliflower-peas/soya methi + 150g salad + buttermilk", veggies: ["cauliflower", "green peas", "methi"], protein: 16, type: "veg" },
  ],
  evening: [
    { name: "Roasted chana", detail: "30g (or swap with makhana/popcorn — no roasted peanut)", veggies: [], type: "snack" },
    { name: "Sprouts with grated veggies", detail: "50g sprouts + grated carrot/cucumber", veggies: ["carrot", "cucumber"], type: "snack" },
    { name: "Mixed seeds ladoo", detail: "3 small (or 2-3 dates)", veggies: [], type: "snack" },
    { name: "Roasted makhana-murmura bhel", detail: "60g + 1 orange", veggies: [], type: "snack" },
    { name: "Greek yogurt + pomegranate", detail: "100g yogurt + pomegranate seeds", veggies: [], type: "snack" },
    { name: "Boiled chana corn chat", detail: "60g chana + corn + onion-tomato", veggies: ["onion", "tomato", "corn"], type: "snack" },
    { name: "Boiled sweet potato + apple", detail: "100g sweet potato + apple + cucumber", veggies: ["sweet potato", "cucumber"], type: "snack" },
  ],
  dinner: [
    { name: "Flaxseed wheat chapati + chickpea curry", detail: "2 small chapatis (1 tbsp flax in flour) + 100g chickpea-tomato or egg curry + 120g cucumber", veggies: ["tomato", "cucumber"], protein: 16, type: "egg" },
    { name: "Foxtail millet dosa + tur dal", detail: "2 small dosas + 100g tur dal with methi leaves + 150g salad", veggies: ["methi"], protein: 12, type: "veg" },
    { name: "Quinoa veg upma + beans curry", detail: "100g quinoa upma + 80g beans-peas + 100g veggie sticks + 150ml buttermilk", veggies: ["beans", "green peas"], protein: 14, type: "veg" },
    { name: "Protein chaat", detail: "80g sprouts/chickpeas + 1 tbsp boiled peanuts + 200g veggies (onion/tomato/cucumber/peas/corn/mint) + olive oil + lemon", veggies: ["onion", "tomato", "cucumber", "green peas", "corn", "mint"], protein: 18, type: "veg" },
    { name: "Chickpea sprouts salad", detail: "100g sprouts + 50g chickpeas + 100g veggies + lemon", veggies: ["onion", "tomato", "cucumber"], protein: 18, type: "veg" },
    { name: "Grilled paneer salad", detail: "60-70g grilled paneer + 150g vegetables + olive oil dressing", veggies: ["lettuce", "tomato", "cucumber", "capsicum"], protein: 20, type: "veg" },
    { name: "Oats moong dal cheela", detail: "2 cheelas + 100g soya chunks veggies + 150g salad", veggies: ["onion", "capsicum"], protein: 22, type: "veg" },
    { name: "Ragi dosa + french beans curry", detail: "2 ragi dosas + 100g french beans-peas + 150g salad", veggies: ["french beans", "green peas"], protein: 12, type: "veg" },
    { name: "Oats idli + sambar", detail: "3 oats idlis + 120g sambar + 150g salad", veggies: ["drumstick", "tomato", "onion"], protein: 12, type: "veg" },
    { name: "Adai dosa + chutney", detail: "2 adai + chutney + 150g sautéed/boiled vegetables", veggies: ["any seasonal"], protein: 14, type: "veg" },
    { name: "Vegetable khichdi", detail: "120g khichdi (oats or rice) + 150g salad", veggies: ["carrot", "beans", "green peas"], protein: 12, type: "veg" },
    { name: "Broccoli chickpea pasta", detail: "120g whole wheat/millet pasta + 150g veggie salad", veggies: ["broccoli", "tomato", "spinach"], protein: 16, type: "veg" },
    { name: "Whole wheat-oats phulka + rajma", detail: "2 phulkas + 100g rajma/chana/paneer curry + 150g salad", veggies: ["onion", "tomato"], protein: 16, type: "veg" },
  ],
  bedtime: [
    { name: "Golden water", detail: "¼ tsp pepper + pinch turmeric in 200ml water boiled to 150ml", veggies: [], type: "drink" },
    { name: "Chamomile tea", detail: "150ml warm, no sweetener", veggies: [], type: "drink" },
    { name: "Fennel water", detail: "1 tsp saunf in 200ml water boiled to 150ml", veggies: [], type: "drink" },
    { name: "Jeera-saunf water", detail: "½ tsp jeera + ½ tsp saunf boiled in 200ml for 5-10 min", veggies: [], type: "drink" },
  ],
};

const COMMON_VEGGIES = [
  "tomato", "onion", "carrot", "cucumber", "spinach", "methi", "drumstick",
  "ladies finger", "beans", "cauliflower", "broccoli", "capsicum", "green peas",
  "amaranth", "curry leaves", "mint", "ginger", "garlic", "potato", "sweet potato",
  "bottle gourd", "ridge gourd", "pumpkin", "radish", "beetroot", "corn",
];

// ============================================================
// LOCALSTORAGE HELPERS (replaces Claude's window.storage)
// ============================================================

const todayKey = () => {
  const d = new Date();
  return `day-${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const prettyDate = () => {
  const d = new Date();
  return d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });
};

const loadDay = () => {
  try {
    const raw = localStorage.getItem(todayKey());
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
};

const saveDay = (data) => {
  try { localStorage.setItem(todayKey(), JSON.stringify(data)); } catch {}
};

const smartPick = (meals, availableVeggies, dietType, lastPicked = null) => {
  let pool = meals.filter((m) => {
    if (dietType === "veg" && m.type === "egg") return false;
    return true;
  });
  if (lastPicked) pool = pool.filter((m) => m.name !== lastPicked);

  if (availableVeggies.length > 0) {
    const scored = pool.map((m) => {
      const matches = m.veggies.filter((v) =>
        availableVeggies.some((av) => av.toLowerCase().includes(v.toLowerCase()) || v.toLowerCase().includes(av.toLowerCase()))
      ).length;
      return { meal: m, score: matches };
    });
    const max = Math.max(...scored.map((s) => s.score));
    if (max > 0) {
      const top = scored.filter((s) => s.score === max);
      return top[Math.floor(Math.random() * top.length)].meal;
    }
  }
  return pool[Math.floor(Math.random() * pool.length)];
};

const generatePlan = (veggies, dietType) => ({
  earlyMorning: smartPick(MEALS.earlyMorning, veggies, dietType),
  breakfast: smartPick(MEALS.breakfast, veggies, dietType),
  midMorning: smartPick(MEALS.midMorning, veggies, dietType),
  lunch: smartPick(MEALS.lunch, veggies, dietType),
  evening: smartPick(MEALS.evening, veggies, dietType),
  dinner: smartPick(MEALS.dinner, veggies, dietType),
  bedtime: smartPick(MEALS.bedtime, veggies, dietType),
});

// ============================================================
// COMPONENT
// ============================================================

export default function HealthTracker() {
  const [stage, setStage] = useState("loading");
  const [dietType, setDietType] = useState("egg");
  const [availableVeggies, setAvailableVeggies] = useState([]);
  const [customVeggie, setCustomVeggie] = useState("");
  const [plan, setPlan] = useState(null);

  const [done, setDone] = useState({});
  const [meds, setMeds] = useState({ thyroxine: false, folic: false });
  const [waterGlasses, setWaterGlasses] = useState(0);
  const [exercise, setExercise] = useState({ done: false, type: "", minutes: 0 });
  const [weight, setWeight] = useState("");
  const [notes, setNotes] = useState("");
  const [showShare, setShowShare] = useState(false);

  useEffect(() => {
    const saved = loadDay();
    if (saved) {
      setDietType(saved.dietType || "egg");
      setAvailableVeggies(saved.availableVeggies || []);
      setPlan(saved.plan);
      setDone(saved.done || {});
      setMeds(saved.meds || { thyroxine: false, folic: false });
      setWaterGlasses(saved.waterGlasses || 0);
      setExercise(saved.exercise || { done: false, type: "", minutes: 0 });
      setWeight(saved.weight || "");
      setNotes(saved.notes || "");
      setStage(saved.plan ? "tracking" : "setup");
    } else {
      setStage("setup");
    }
  }, []);

  useEffect(() => {
    if (stage === "loading" || stage === "setup") return;
    saveDay({ dietType, availableVeggies, plan, done, meds, waterGlasses, exercise, weight, notes });
  }, [stage, dietType, availableVeggies, plan, done, meds, waterGlasses, exercise, weight, notes]);

  const toggleVeggie = (v) => setAvailableVeggies((p) => p.includes(v) ? p.filter((x) => x !== v) : [...p, v]);
  const addCustomVeggie = () => {
    const v = customVeggie.trim().toLowerCase();
    if (v && !availableVeggies.includes(v)) { setAvailableVeggies([...availableVeggies, v]); setCustomVeggie(""); }
  };
  const buildPlan = () => { setPlan(generatePlan(availableVeggies, dietType)); setStage("tracking"); };
  const reshufflePlan = () => setPlan(generatePlan(availableVeggies, dietType));
  const reshuffleSlot = (slot) => {
    const last = plan[slot]?.name;
    setPlan({ ...plan, [slot]: smartPick(MEALS[slot], availableVeggies, dietType, last) });
    setDone({ ...done, [slot]: false });
  };

  const totalProtein = useMemo(() => {
    if (!plan) return 0;
    return ["breakfast", "lunch", "dinner"].reduce((sum, s) => sum + (plan[s]?.protein || 0), 0);
  }, [plan]);

  const completedSlots = Object.values(done).filter(Boolean).length;
  const waterMl = waterGlasses * 250;
  const waterPct = Math.min(100, (waterMl / 3500) * 100);

  const whatsappSummary = useMemo(() => {
    if (!plan) return "";
    const slot = (label, key) => `${done[key] ? "✅" : "⬜"} *${label}:* ${plan[key].name}`;
    return `🌿 *${prettyDate()}* 🌿\n\n` +
      `*Today's Plan*\n${slot("Early AM", "earlyMorning")}\n${slot("Breakfast", "breakfast")}\n${slot("Mid-morning", "midMorning")}\n${slot("Lunch", "lunch")}\n${slot("Evening", "evening")}\n${slot("Dinner", "dinner")}\n${slot("Bedtime", "bedtime")}\n\n` +
      `*Medicines* 💊\n${meds.thyroxine ? "✅" : "⬜"} Thyroxine (morning, empty stomach)\n${meds.folic ? "✅" : "⬜"} Folic Acid (post-dinner)\n\n` +
      `*Stats*\n💧 Water: ${waterMl}ml / 3500ml (${waterGlasses} glasses)\n🏃 Exercise: ${exercise.done ? `${exercise.type || "done"} — ${exercise.minutes} min` : "pending"}\n⚖️  Weight: ${weight || "—"} kg\n🥗 Veggies used: ${availableVeggies.join(", ") || "—"}\n` +
      (notes ? `\n📝 ${notes}\n` : "") +
      `\n_${completedSlots}/7 meals + ${meds.thyroxine && meds.folic ? "all meds ✓" : "meds pending"}_`;
  }, [plan, done, meds, waterGlasses, exercise, weight, notes, availableVeggies, completedSlots, waterMl]);

  const copyWhatsApp = async () => {
    try {
      await navigator.clipboard.writeText(whatsappSummary);
      alert("Copied! Open WhatsApp and paste.");
    } catch {
      alert("Couldn't copy automatically — long-press the text above to select and copy.");
    }
  };

  const shareApp = async () => {
    const url = window.location.href;
    const text = `Hey! I've been using this little health tracker — daily meal plans from my dietician's chart, water + meds + exercise tracking, and a one-tap WhatsApp summary. Adding it to your iPhone home screen takes 30 seconds. Try it: ${url}`;
    if (navigator.share) {
      try { await navigator.share({ title: "Daily Health Tracker", text, url }); return; } catch {}
    }
    try {
      await navigator.clipboard.writeText(text);
      alert("Share link copied! Paste it in any chat.");
    } catch {
      setShowShare(true);
    }
  };

  if (stage === "loading") {
    return <div className="min-h-screen bg-stone-50 flex items-center justify-center text-stone-600 font-serif">Loading your day…</div>;
  }

  return (
    <div className="min-h-screen bg-stone-50" style={{ fontFamily: "'Fraunces', 'Georgia', serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />

      <style>{`
        .mono { font-family: 'DM Mono', monospace; }
        .display { font-family: 'Fraunces', serif; font-variation-settings: "opsz" 144; }
        .grain { background-image: radial-gradient(circle at 1px 1px, rgba(120,113,108,0.06) 1px, transparent 0); background-size: 20px 20px; }
        .check-tick { transition: all .25s cubic-bezier(.34,1.56,.64,1); }
        .check-tick.on { transform: scale(1.05); }
        .glass-fill { transition: all .4s cubic-bezier(.4,0,.2,1); }
      `}</style>

      <div className="grain border-b border-stone-200 safe-top">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <div className="flex items-baseline justify-between gap-4">
            <div className="min-w-0">
              <p className="mono text-xs uppercase tracking-[0.2em] text-stone-500 mb-1">Daily Health Ledger</p>
              <h1 className="display text-3xl sm:text-4xl text-stone-900 leading-none">Today.</h1>
              <p className="mono text-xs text-stone-500 mt-2">{prettyDate()}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="mono text-[10px] uppercase tracking-widest text-stone-400">Target</p>
              <p className="mono text-xs text-stone-700">1600 kcal · 60–68g</p>
              <p className="mono text-xs text-stone-500">3.5L water</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {stage === "setup" && (
          <div className="space-y-8">
            <div className="bg-white border border-stone-200 rounded-sm p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sun className="w-4 h-4 text-amber-600" />
                <p className="mono text-xs uppercase tracking-widest text-stone-600">Morning Check-in</p>
              </div>
              <h2 className="display text-2xl text-stone-900 mb-2">What's in your kitchen today?</h2>
              <p className="text-stone-600 text-sm mb-6">Tap the veggies you have at home. The plan will lean toward meals that use them.</p>

              <div className="mb-5">
                <p className="mono text-[11px] uppercase tracking-wider text-stone-500 mb-3">Diet preference</p>
                <div className="flex gap-2">
                  {[{ key: "egg", label: "Eggetarian" }, { key: "veg", label: "Vegetarian" }].map((d) => (
                    <button key={d.key} onClick={() => setDietType(d.key)}
                      className={`px-4 py-2 text-sm rounded-sm border transition-colors ${dietType === d.key ? "bg-stone-900 text-stone-50 border-stone-900" : "bg-white text-stone-700 border-stone-300"}`}>
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              <p className="mono text-[11px] uppercase tracking-wider text-stone-500 mb-3">Available veggies</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {COMMON_VEGGIES.map((v) => (
                  <button key={v} onClick={() => toggleVeggie(v)}
                    className={`px-3 py-1.5 text-xs rounded-full border transition-all ${availableVeggies.includes(v) ? "bg-emerald-700 text-emerald-50 border-emerald-700" : "bg-white text-stone-600 border-stone-300"}`}>
                    {v}
                  </button>
                ))}
              </div>

              <div className="flex gap-2 mb-6">
                <input type="text" value={customVeggie} onChange={(e) => setCustomVeggie(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addCustomVeggie()}
                  placeholder="Add another (e.g. snake gourd)"
                  className="flex-1 px-3 py-2 text-sm border border-stone-300 rounded-sm focus:outline-none focus:border-stone-700 bg-white" />
                <button onClick={addCustomVeggie} className="px-4 py-2 text-sm bg-stone-100 border border-stone-300 rounded-sm">+ Add</button>
              </div>

              <button onClick={buildPlan} className="w-full py-3 bg-stone-900 text-stone-50 rounded-sm flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span className="mono text-xs uppercase tracking-widest">Build today's plan</span>
              </button>
            </div>
          </div>
        )}

        {stage === "tracking" && plan && (
          <div className="space-y-5 sm:space-y-6">
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              <StatCard icon={<Apple className="w-3.5 h-3.5" />} label="Meals" value={`${completedSlots}/7`} />
              <StatCard icon={<Pill className="w-3.5 h-3.5" />} label="Meds" value={`${(meds.thyroxine ? 1 : 0) + (meds.folic ? 1 : 0)}/2`} />
              <StatCard icon={<Droplet className="w-3.5 h-3.5" />} label="Water" value={`${(waterMl / 1000).toFixed(1)}L`} />
              <StatCard icon={<Dumbbell className="w-3.5 h-3.5" />} label="Move" value={exercise.done ? `${exercise.minutes}m` : "—"} />
            </div>

            <Section title="Medicines" subtitle="Thyroxine timing matters — empty stomach, then wait 30–45 min before food/coffee">
              <MedRow label="Thyroxine" hint="First thing in morning, empty stomach" icon={<Sun className="w-4 h-4 text-amber-600" />} checked={meds.thyroxine} onChange={(v) => setMeds({ ...meds, thyroxine: v })} />
              <MedRow label="Folic Acid" hint="After dinner" icon={<Moon className="w-4 h-4 text-indigo-600" />} checked={meds.folic} onChange={(v) => setMeds({ ...meds, folic: v })} />
            </Section>

            <Section title="Today's Plate" subtitle={`Estimated protein from main meals: ~${totalProtein}g`}
              right={<button onClick={reshufflePlan} className="mono text-[10px] uppercase tracking-widest text-stone-500 flex items-center gap-1"><RefreshCw className="w-3 h-3" /> Reshuffle</button>}>
              {[
                { key: "earlyMorning", label: "Early Morning", time: "6:30 AM" },
                { key: "breakfast", label: "Breakfast", time: "8:30 AM" },
                { key: "midMorning", label: "Mid-Morning", time: "11:00 AM" },
                { key: "lunch", label: "Lunch", time: "1:00 PM" },
                { key: "evening", label: "Evening Snack", time: "5:30 PM" },
                { key: "dinner", label: "Dinner", time: "7:30 PM" },
                { key: "bedtime", label: "Bedtime", time: "10:00 PM" },
              ].map((slot) => (
                <MealRow key={slot.key} label={slot.label} time={slot.time} meal={plan[slot.key]}
                  checked={!!done[slot.key]} onCheck={(v) => setDone({ ...done, [slot.key]: v })}
                  onShuffle={() => reshuffleSlot(slot.key)} />
              ))}
            </Section>

            <Section title="Hydration" subtitle="Goal: 3.5L / day · 1 glass ≈ 250ml">
              <div className="flex items-center gap-1.5 flex-wrap mb-4">
                {Array.from({ length: 14 }).map((_, i) => (
                  <button key={i} onClick={() => setWaterGlasses(i + 1 === waterGlasses ? i : i + 1)}
                    className={`w-7 h-10 rounded-sm border glass-fill ${i < waterGlasses ? "bg-sky-600 border-sky-700" : "bg-white border-stone-300"}`} />
                ))}
              </div>
              <div className="flex items-baseline justify-between">
                <p className="mono text-xs text-stone-500">{waterMl}ml of 3500ml</p>
                <p className="mono text-xs text-stone-700">{Math.round(waterPct)}%</p>
              </div>
              <div className="mt-2 h-1 bg-stone-200 rounded-full overflow-hidden">
                <div className="h-full bg-sky-600 transition-all" style={{ width: `${waterPct}%` }} />
              </div>
            </Section>

            <Section title="Movement" subtitle="Aim for 150 min/week of moderate exercise">
              <label className="flex items-center gap-3 cursor-pointer">
                <Checkbox checked={exercise.done} onChange={(v) => setExercise({ ...exercise, done: v })} />
                <span className="text-sm text-stone-800">Did exercise today</span>
              </label>
              {exercise.done && (
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <input type="text" value={exercise.type} onChange={(e) => setExercise({ ...exercise, type: e.target.value })}
                    placeholder="Walk / Yoga / Strength…"
                    className="px-3 py-2 text-sm border border-stone-300 rounded-sm bg-white focus:outline-none focus:border-stone-700" />
                  <input type="number" value={exercise.minutes || ""} onChange={(e) => setExercise({ ...exercise, minutes: parseInt(e.target.value) || 0 })}
                    placeholder="Minutes"
                    className="px-3 py-2 text-sm border border-stone-300 rounded-sm bg-white focus:outline-none focus:border-stone-700" />
                </div>
              )}
            </Section>

            <Section title="Today's Log">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Scale className="w-4 h-4 text-stone-500" />
                  <input type="number" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)}
                    placeholder="Weight (kg) — optional"
                    className="flex-1 px-3 py-2 text-sm border border-stone-300 rounded-sm bg-white focus:outline-none focus:border-stone-700" />
                </div>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
                  placeholder="How did you feel? Energy? Cravings? Sleep?" rows={2}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-sm bg-white focus:outline-none focus:border-stone-700" />
              </div>
            </Section>

            <Section title="WhatsApp Summary" subtitle="Copy and paste into a chat with yourself or your accountability partner">
              <pre className="mono text-[11px] bg-stone-900 text-stone-100 p-4 rounded-sm overflow-x-auto whitespace-pre-wrap leading-relaxed mb-3">{whatsappSummary}</pre>
              <div className="flex gap-2">
                <button onClick={copyWhatsApp} className="flex-1 py-2.5 bg-emerald-700 text-emerald-50 rounded-sm flex items-center justify-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  <span className="mono text-xs uppercase tracking-widest">Copy for WhatsApp</span>
                </button>
                <button onClick={() => setStage("setup")} className="px-4 py-2.5 bg-white border border-stone-300 text-stone-700 rounded-sm mono text-xs uppercase tracking-widest">
                  Edit veggies
                </button>
              </div>
            </Section>

            <div className="bg-rose-50 border border-rose-200 rounded-sm p-5">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-4 h-4 text-rose-600" />
                <p className="mono text-xs uppercase tracking-widest text-rose-700">Share the love</p>
              </div>
              <p className="text-sm text-stone-700 mb-4 leading-relaxed">Know someone with a diet chart they're trying to follow? Pass this along — it's free, runs offline, and takes 30 seconds to add to a home screen.</p>
              <button onClick={shareApp} className="w-full py-2.5 bg-rose-600 text-rose-50 rounded-sm flex items-center justify-center gap-2">
                <Share2 className="w-4 h-4" />
                <span className="mono text-xs uppercase tracking-widest">Share with a friend</span>
              </button>
              {showShare && (
                <p className="text-xs text-stone-500 mt-3">Copy this link manually: <span className="mono text-stone-700 break-all">{window.location.href}</span></p>
              )}
            </div>

            <div className="border-l-2 border-amber-600 pl-4 py-2">
              <p className="mono text-[10px] uppercase tracking-widest text-amber-700 mb-1 flex items-center gap-1">
                <Coffee className="w-3 h-3" /> Thyroxine tip
              </p>
              <p className="text-sm text-stone-700 leading-relaxed">Take it the moment you wake up with plain water. Then wait at least 30–45 minutes before fenugreek water, lemon honey, coffee, or breakfast — calcium, iron, and caffeine all interfere with absorption.</p>
            </div>
          </div>
        )}
      </div>

      <footer className="max-w-3xl mx-auto px-6 py-10 text-center safe-bottom">
        <p className="mono text-[10px] uppercase tracking-[0.3em] text-stone-400">Eat clean · Be happy</p>
      </footer>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white border border-stone-200 rounded-sm p-2.5 sm:p-3">
      <div className="flex items-center gap-1.5 text-stone-500 mb-1">{icon}<span className="mono text-[9px] sm:text-[10px] uppercase tracking-widest">{label}</span></div>
      <p className="display text-lg sm:text-xl text-stone-900">{value}</p>
    </div>
  );
}

function Section({ title, subtitle, children, right }) {
  return (
    <div className="bg-white border border-stone-200 rounded-sm p-4 sm:p-5">
      <div className="flex items-start justify-between mb-4 gap-2">
        <div className="min-w-0">
          <h3 className="display text-lg text-stone-900 leading-tight">{title}</h3>
          {subtitle && <p className="text-xs text-stone-500 mt-0.5">{subtitle}</p>}
        </div>
        {right}
      </div>
      {children}
    </div>
  );
}

function Checkbox({ checked, onChange }) {
  return (
    <button onClick={() => onChange(!checked)}
      className={`w-5 h-5 rounded-sm border-2 flex items-center justify-center check-tick shrink-0 ${checked ? "on bg-stone-900 border-stone-900" : "bg-white border-stone-400"}`}>
      {checked && <Check className="w-3 h-3 text-stone-50" strokeWidth={3} />}
    </button>
  );
}

function MedRow({ label, hint, icon, checked, onChange }) {
  return (
    <div className={`flex items-center gap-3 py-3 border-b border-stone-100 last:border-0 ${checked ? "opacity-60" : ""}`}>
      <Checkbox checked={checked} onChange={onChange} />
      <div className="flex items-center gap-2 flex-1">{icon}
        <div><p className={`text-sm text-stone-900 ${checked ? "line-through" : ""}`}>{label}</p><p className="text-xs text-stone-500">{hint}</p></div>
      </div>
    </div>
  );
}

function MealRow({ label, time, meal, checked, onCheck, onShuffle }) {
  return (
    <div className={`py-3 border-b border-stone-100 last:border-0 ${checked ? "opacity-50" : ""}`}>
      <div className="flex items-start gap-3">
        <div className="pt-0.5"><Checkbox checked={checked} onChange={onCheck} /></div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-3">
            <div className="flex items-baseline gap-2 flex-wrap">
              <p className="mono text-[10px] uppercase tracking-widest text-stone-500">{label}</p>
              <p className="mono text-[10px] text-stone-400">{time}</p>
            </div>
            <button onClick={onShuffle} className="mono text-[10px] uppercase tracking-widest text-stone-400 flex items-center gap-1 shrink-0">
              <RefreshCw className="w-2.5 h-2.5" /> swap
            </button>
          </div>
          <p className={`text-sm text-stone-900 mt-0.5 ${checked ? "line-through" : ""}`}>{meal.name}</p>
          <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">{meal.detail}</p>
        </div>
      </div>
    </div>
  );
}
