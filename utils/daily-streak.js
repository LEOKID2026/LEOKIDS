// Utility functions for managing daily streaks across all learning games

export function getTodayKey() {
  const today = new Date();
  return `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
}

export function getYesterdayKey() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return `${yesterday.getFullYear()}-${yesterday.getMonth()}-${yesterday.getDate()}`;
}

export function loadDailyStreak(storageKey = "mleo_daily_streak") {
  if (typeof window === "undefined") return { streak: 0, lastDate: null };
  
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "{}");
    const todayKey = getTodayKey();
    const yesterdayKey = getYesterdayKey();
    
    //      -  
    if (saved.lastDate === todayKey) {
      return { streak: saved.streak || 0, lastDate: todayKey };
    }
    
    //        -  
    if (saved.lastDate === yesterdayKey) {
      return { streak: (saved.streak || 0) + 1, lastDate: todayKey };
    }
    
    //     -   
    return { streak: 1, lastDate: todayKey };
  } catch {
    return { streak: 1, lastDate: getTodayKey() };
  }
}

export function updateDailyStreak(storageKey = "mleo_daily_streak") {
  if (typeof window === "undefined") return { streak: 0, lastDate: null };
  
  try {
    const todayKey = getTodayKey();
    const yesterdayKey = getYesterdayKey();
    const saved = JSON.parse(localStorage.getItem(storageKey) || "{}");
    
    let newStreak = 1;
    
    //      -  
    if (saved.lastDate === todayKey) {
      newStreak = saved.streak || 0;
    }
    //        -  
    else if (saved.lastDate === yesterdayKey) {
      newStreak = (saved.streak || 0) + 1;
    }
    //     -   
    else {
      newStreak = 1;
    }
    
    const updated = { streak: newStreak, lastDate: todayKey };
    localStorage.setItem(storageKey, JSON.stringify(updated));
    
    return updated;
  } catch {
    const todayKey = getTodayKey();
    const updated = { streak: 1, lastDate: todayKey };
    localStorage.setItem(storageKey, JSON.stringify(updated));
    return updated;
  }
}

export function getStreakReward(streak) {
  if (streak >= 30) return { emoji: "👑", message: "30-day streak! You're a champion!" };
  if (streak >= 14) return { emoji: "🌟", message: "14-day streak! Well done!" };
  if (streak >= 7) return { emoji: "⭐", message: "One-week streak! Nice work!" };
  if (streak >= 3) return { emoji: "🔥", message: "3-day streak! Keep it up!" };
  return null;
}

