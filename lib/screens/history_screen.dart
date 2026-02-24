import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:fl_chart/fl_chart.dart';
import '../providers/fitness_provider.dart';
import '../models/daily_activity.dart';

class HistoryScreen extends StatelessWidget {
  const HistoryScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('History'),
      ),
      body: Consumer<FitnessProvider>(
        builder: (_, provider, __) {
          final data = provider.last7DaysActivity;
          if (data.every((d) => d.steps == 0 && d.caloriesBurned == 0)) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.bar_chart,
                    size: 64,
                    color: Theme.of(context).colorScheme.outline,
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'No activity data yet',
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                ],
              ),
            );
          }
          return SingleChildScrollView(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Last 7 Days - Steps',
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.w600,
                      ),
                ),
                const SizedBox(height: 24),
                SizedBox(
                  height: 220,
                  child: _StepsBarChart(data: data),
                ),
                const SizedBox(height: 32),
                Text(
                  'Daily summary',
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.w600,
                      ),
                ),
                const SizedBox(height: 12),
                ...data.reversed.map((d) => _HistoryTile(activity: d)),
              ],
            ),
          );
        },
      ),
    );
  }
}

class _StepsBarChart extends StatelessWidget {
  const _StepsBarChart({required this.data});
  final List<DailyActivity> data;

  @override
  Widget build(BuildContext context) {
    final maxY = data.isEmpty
        ? 1.0
        : data.map((e) => e.steps.toDouble()).reduce((a, b) => a > b ? a : b);
    final maxYVal = (maxY < 1 ? 1 : maxY * 1.2).ceil().toDouble();

    return BarChart(
      BarChartData(
        alignment: BarChartAlignment.spaceAround,
        maxY: maxYVal,
        barTouchData: BarTouchData(enabled: true),
        titlesData: FlTitlesData(
          show: true,
          bottomTitles: AxisTitles(
            sideTitles: SideTitles(
              showTitles: true,
              getTitlesWidget: (value, meta) {
                final i = value.toInt();
                if (i >= 0 && i < data.length) {
                  final date = data[i].date;
                  final parts = date.split('-');
                  if (parts.length == 3) {
                    return Padding(
                      padding: const EdgeInsets.only(top: 8),
                      child: Text(
                        '${parts[1]}/${parts[2]}',
                        style: Theme.of(context).textTheme.bodySmall,
                      ),
                    );
                  }
                }
                return const SizedBox.shrink();
              },
              reservedSize: 32,
              interval: 1,
            ),
          ),
          leftTitles: AxisTitles(
            sideTitles: SideTitles(
              showTitles: true,
              reservedSize: 40,
              getTitlesWidget: (value, meta) => Text(
                value.toInt().toString(),
                style: Theme.of(context).textTheme.bodySmall,
              ),
            ),
          ),
          topTitles: const AxisTitles(
            sideTitles: SideTitles(showTitles: false),
          ),
          rightTitles: const AxisTitles(
            sideTitles: SideTitles(showTitles: false),
          ),
        ),
        gridData: FlGridData(
          show: true,
          drawVerticalLine: false,
          horizontalInterval: maxYVal / 4,
          getDrawingHorizontalLine: (value) => FlLine(
            color: Theme.of(context).colorScheme.outline.withOpacity(0.2),
            strokeWidth: 1,
          ),
        ),
        borderData: FlBorderData(show: false),
        barGroups: data.asMap().entries.map((e) {
          return BarChartGroupData(
            x: e.key,
            barRods: [
              BarChartRodData(
                toY: e.value.steps.toDouble(),
                color: Theme.of(context).colorScheme.primary,
                width: 20,
                borderRadius: const BorderRadius.vertical(top: Radius.circular(4)),
              ),
            ],
            showingTooltipIndicators: [0],
          );
        }).toList(),
      ),
    );
  }
}

class _HistoryTile extends StatelessWidget {
  const _HistoryTile({required this.activity});
  final DailyActivity activity;

  @override
  Widget build(BuildContext context) {
    final parts = activity.date.split('-');
    final label = parts.length == 3 ? '${parts[1]}/${parts[2]}/${parts[0]}' : activity.date;
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: ListTile(
        title: Text(label),
        subtitle: Text(
          '${activity.steps} steps • ${activity.caloriesBurned} kcal • ${activity.waterGlasses} glasses • ${activity.workoutCount} workout(s)',
        ),
      ),
    );
  }
}
