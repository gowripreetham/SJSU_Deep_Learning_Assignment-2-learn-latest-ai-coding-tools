/// User's daily fitness goals.
class FitnessGoals {
  final int stepGoal;
  final int calorieGoal;
  final int waterGoal;

  const FitnessGoals({
    this.stepGoal = 10000,
    this.calorieGoal = 500,
    this.waterGoal = 8,
  });

  Map<String, dynamic> toJson() => {
        'stepGoal': stepGoal,
        'calorieGoal': calorieGoal,
        'waterGoal': waterGoal,
      };

  factory FitnessGoals.fromJson(Map<String, dynamic> json) => FitnessGoals(
        stepGoal: json['stepGoal'] as int? ?? 10000,
        calorieGoal: json['calorieGoal'] as int? ?? 500,
        waterGoal: json['waterGoal'] as int? ?? 8,
      );
}
