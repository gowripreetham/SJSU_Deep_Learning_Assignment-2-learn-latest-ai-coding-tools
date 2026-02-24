/// Model for a single workout session.
class Workout {
  final String id;
  final String type;
  final int durationMinutes;
  final int calories;
  final String date; // yyyy-mm-dd

  const Workout({
    required this.id,
    required this.type,
    required this.durationMinutes,
    required this.calories,
    required this.date,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'type': type,
        'durationMinutes': durationMinutes,
        'calories': calories,
        'date': date,
      };

  factory Workout.fromJson(Map<String, dynamic> json) => Workout(
        id: json['id'] as String,
        type: json['type'] as String,
        durationMinutes: json['durationMinutes'] as int,
        calories: json['calories'] as int,
        date: json['date'] as String,
      );
}
