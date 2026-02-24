import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/workout.dart';
import '../models/fitness_goals.dart';
import '../models/daily_activity.dart';

class FitnessProvider with ChangeNotifier {
  static const _keyGoals = 'fitpulse_goals';
  static const _keyWorkouts = 'fitpulse_workouts';
  static const _keyDailySteps = 'fitpulse_daily_steps';
  static const _keyDailyWater = 'fitpulse_daily_water';

  FitnessGoals _goals = const FitnessGoals();
  List<Workout> _workouts = [];
  Map<String, int> _dailySteps = {};
  Map<String, int> _dailyWater = {};

  FitnessGoals get goals => _goals;
  List<Workout> get workouts => List.unmodifiable(_workouts);

  String get _today => DateTime.now().toIso8601String().split('T').first;

  int get todaySteps => _dailySteps[_today] ?? 0;
  int get todayWater => _dailyWater[_today] ?? 0;
  int get todayCalories =>
      _workouts.where((w) => w.date == _today).fold(0, (s, w) => s + w.calories);
  List<Workout> get todayWorkouts =>
      _workouts.where((w) => w.date == _today).toList();

  int get workoutStreak {
    int streak = 0;
    DateTime d = DateTime.now();
    for (int i = 0; i < 365; i++) {
      final dateStr =
          '${d.year}-${d.month.toString().padLeft(2, '0')}-${d.day.toString().padLeft(2, '0')}';
      final hasWorkout = _workouts.any((w) => w.date == dateStr);
      if (hasWorkout) {
        streak++;
        d = d.subtract(const Duration(days: 1));
      } else {
        break;
      }
    }
    return streak;
  }

  /// Set to true for prototype demo: always load demo data on start.
  static const bool _useDemoData = true;

  Future<void> load() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      _loadGoals(prefs);
      _loadWorkouts(prefs);
      _loadDailySteps(prefs);
      _loadDailyWater(prefs);
      if (_useDemoData && _workouts.isEmpty && _dailySteps.isEmpty && _dailyWater.isEmpty) {
        await _seedDemoData(prefs);
      }
    } catch (e, st) {
      debugPrint('FitnessProvider load error: $e $st');
      if (_workouts.isEmpty && _dailySteps.isEmpty && _dailyWater.isEmpty) {
        _goals = const FitnessGoals(stepGoal: 10000, calorieGoal: 500, waterGoal: 8);
      }
    }
    notifyListeners();
  }

  /// Seeds prototype data so the app looks populated for demo.
  Future<void> _seedDemoData(SharedPreferences prefs) async {
    _goals = const FitnessGoals(stepGoal: 10000, calorieGoal: 500, waterGoal: 8);
    await prefs.setString(_keyGoals, jsonEncode(_goals.toJson()));

    final now = DateTime.now();
    final today =
        '${now.year}-${now.month.toString().padLeft(2, '0')}-${now.day.toString().padLeft(2, '0')}';
    _dailySteps[today] = 7200;
    for (int i = 1; i <= 6; i++) {
      final d = now.subtract(Duration(days: i));
      final dateStr =
          '${d.year}-${d.month.toString().padLeft(2, '0')}-${d.day.toString().padLeft(2, '0')}';
      _dailySteps[dateStr] = 3000 + (i * 800) + (i % 3 * 500);
    }
    await prefs.setString(_keyDailySteps, jsonEncode(_dailySteps));

    _dailyWater[today] = 5;
    for (int i = 1; i <= 6; i++) {
      final d = now.subtract(Duration(days: i));
      final dateStr =
          '${d.year}-${d.month.toString().padLeft(2, '0')}-${d.day.toString().padLeft(2, '0')}';
      _dailyWater[dateStr] = 4 + (i % 4);
    }
    await prefs.setString(_keyDailyWater, jsonEncode(_dailyWater));

    final baseId = now.millisecondsSinceEpoch;
    _workouts = [
      Workout(
          id: '${baseId}1',
          type: 'Running',
          durationMinutes: 30,
          calories: 280,
          date: today),
      Workout(
          id: '${baseId}2',
          type: 'Gym',
          durationMinutes: 45,
          calories: 320,
          date: today),
      Workout(
          id: '${baseId}3',
          type: 'Walking',
          durationMinutes: 20,
          calories: 90,
          date: today),
    ];
    for (int i = 1; i <= 6; i++) {
      final d = now.subtract(Duration(days: i));
      final dateStr =
          '${d.year}-${d.month.toString().padLeft(2, '0')}-${d.day.toString().padLeft(2, '0')}';
      _workouts.add(Workout(
          id: '${baseId}_$i',
          type: i.isEven ? 'Running' : 'Gym',
          durationMinutes: 25 + (i * 5),
          calories: 150 + (i * 30),
          date: dateStr));
    }
    await prefs.setString(
        _keyWorkouts, jsonEncode(_workouts.map((e) => e.toJson()).toList()));
  }

  void _loadGoals(SharedPreferences prefs) {
    final json = prefs.getString(_keyGoals);
    if (json != null) {
      try {
        _goals = FitnessGoals.fromJson(
            Map<String, dynamic>.from(jsonDecode(json) as Map));
      } catch (_) {}
    }
  }

  void _loadWorkouts(SharedPreferences prefs) {
    final json = prefs.getString(_keyWorkouts);
    if (json != null) {
      try {
        final list = jsonDecode(json) as List<dynamic>;
        _workouts =
            list.map((e) => Workout.fromJson(Map<String, dynamic>.from(e))).toList();
      } catch (_) {}
    }
  }

  void _loadDailySteps(SharedPreferences prefs) {
    final json = prefs.getString(_keyDailySteps);
    if (json != null) {
      try {
        final map = jsonDecode(json) as Map<String, dynamic>;
        _dailySteps = map.map((k, v) => MapEntry(k, v as int));
      } catch (_) {}
    }
  }

  void _loadDailyWater(SharedPreferences prefs) {
    final json = prefs.getString(_keyDailyWater);
    if (json != null) {
      try {
        final map = jsonDecode(json) as Map<String, dynamic>;
        _dailyWater = map.map((k, v) => MapEntry(k, v as int));
      } catch (_) {}
    }
  }

  Future<void> saveGoals(FitnessGoals g) async {
    _goals = g;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_keyGoals, jsonEncode(g.toJson()));
    notifyListeners();
  }

  Future<void> addWorkout(Workout w) async {
    _workouts.add(w);
    await _persistWorkouts();
    notifyListeners();
  }

  Future<void> deleteWorkout(String id) async {
    _workouts.removeWhere((w) => w.id == id);
    await _persistWorkouts();
    notifyListeners();
  }

  Future<void> _persistWorkouts() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(
      _keyWorkouts,
      jsonEncode(_workouts.map((e) => e.toJson()).toList()),
    );
  }

  Future<void> addSteps(int steps) async {
    final current = _dailySteps[_today] ?? 0;
    _dailySteps[_today] = current + steps;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_keyDailySteps, jsonEncode(_dailySteps));
    notifyListeners();
  }

  Future<void> setTodaySteps(int value) async {
    _dailySteps[_today] = value.clamp(0, 999999);
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_keyDailySteps, jsonEncode(_dailySteps));
    notifyListeners();
  }

  Future<void> addWater(int glasses) async {
    final current = _dailyWater[_today] ?? 0;
    _dailyWater[_today] = current + glasses;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_keyDailyWater, jsonEncode(_dailyWater));
    notifyListeners();
  }

  Future<void> setTodayWater(int glasses) async {
    _dailyWater[_today] = glasses.clamp(0, 99);
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_keyDailyWater, jsonEncode(_dailyWater));
    notifyListeners();
  }

  /// Last 7 days of activity for the history chart.
  List<DailyActivity> get last7DaysActivity {
    final list = <DailyActivity>[];
    for (int i = 6; i >= 0; i--) {
      final d = DateTime.now().subtract(Duration(days: i));
      final dateStr =
          '${d.year}-${d.month.toString().padLeft(2, '0')}-${d.day.toString().padLeft(2, '0')}';
      final dayWorkouts = _workouts.where((w) => w.date == dateStr).toList();
      list.add(DailyActivity(
        date: dateStr,
        steps: _dailySteps[dateStr] ?? 0,
        caloriesBurned: dayWorkouts.fold(0, (s, w) => s + w.calories),
        waterGlasses: _dailyWater[dateStr] ?? 0,
        workoutCount: dayWorkouts.length,
      ));
    }
    return list;
  }
}
