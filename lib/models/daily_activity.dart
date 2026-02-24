/// Summary of activity for a single day (for history/charts).
class DailyActivity {
  final String date; // yyyy-mm-dd
  final int steps;
  final int caloriesBurned;
  final int waterGlasses;
  final int workoutCount;

  const DailyActivity({
    required this.date,
    required this.steps,
    required this.caloriesBurned,
    required this.waterGlasses,
    required this.workoutCount,
  });
}
