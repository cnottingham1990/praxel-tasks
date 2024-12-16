'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

// Main Planner Component
const TaskPlanner = () => {
  // Initialize 40 yellow and 40 green tasks
  const initialTasks = [
    ...Array(40).fill().map((_, i) => ({
      id: i,
      description: '',
      duration: '',
      isCompleted: false,
      isDeferred: false,
      isMandatory: false,
      type: 'regular',
      monday: '',
      tuesday: '',
      wednesday: '',
      thursday: '',
      friday: '',
      category: 'yellow',
    })),
    ...Array(40).fill().map((_, i) => ({
      id: i + 40,
      description: '',
      duration: '',
      isCompleted: false,
      isDeferred: false,
      isMandatory: false,
      type: 'regular',
      monday: '',
      tuesday: '',
      wednesday: '',
      thursday: '',
      friday: '',
      category: 'green',
    })),
  ];

  const [tasks, setTasks] = useState(initialTasks);
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    managerEmail: '',
  });

  const handleTaskChange = (index: number, field: string, value: any) => {
    const updatedTasks = [...tasks];
    updatedTasks[index][field] = value;
    setTasks(updatedTasks);
  };

  const handleSubmit = async () => {
    const formattedData = {
      userInfo,
      tasks,
      weekNumber: new Date().getWeek(),
      totalHours: calculateTotalHours(),
    };

    try {
      const response = await fetch('/api/submit-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedData),
      });
      
      if (response.ok) {
        alert('Tasks submitted successfully!');
      } else {
        throw new Error('Failed to submit tasks');
      }
    } catch (error) {
      console.error('Error submitting tasks:', error);
      alert('Error submitting tasks. Please try again.');
    }
  };

  const calculateTotalHours = () => {
    return tasks.reduce((total, task) => {
      const dailySum = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
        .reduce((sum, day) => sum + (parseFloat(task[day]) || 0), 0);
      return total + dailySum;
    }, 0);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-6">
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-2xl font-bold">User Information</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={userInfo.name}
                onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={userInfo.email}
                onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="managerEmail">Manager's Email</Label>
              <Input
                id="managerEmail"
                type="email"
                value={userInfo.managerEmail}
                onChange={(e) => setUserInfo({ ...userInfo, managerEmail: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-2xl font-bold">Weekly Task Planner</h2>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted">
                  <th className="p-2 border">Task Description</th>
                  <th className="p-2 border">Duration</th>
                  <th className="p-2 border">Complete</th>
                  <th className="p-2 border">Defer</th>
                  <th className="p-2 border">Mandatory</th>
                  <th className="p-2 border">Mon</th>
                  <th className="p-2 border">Tue</th>
                  <th className="p-2 border">Wed</th>
                  <th className="p-2 border">Thu</th>
                  <th className="p-2 border">Fri</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task, index) => (
                  <tr key={task.id} className={task.category === 'yellow' ? 'bg-yellow-50' : 'bg-green-50'}>
                    <td className="p-2 border">
                      <Input
                        value={task.description}
                        onChange={(e) => handleTaskChange(index, 'description', e.target.value)}
                      />
                    </td>
                    <td className="p-2 border">
                      <Input
                        type="number"
                        value={task.duration}
                        onChange={(e) => handleTaskChange(index, 'duration', e.target.value)}
                      />
                    </td>
                    <td className="p-2 border text-center">
                      <Checkbox
                        checked={task.isCompleted}
                        onCheckedChange={(checked) => handleTaskChange(index, 'isCompleted', checked)}
                      />
                    </td>
                    <td className="p-2 border text-center">
                      <Checkbox
                        checked={task.isDeferred}
                        onCheckedChange={(checked) => handleTaskChange(index, 'isDeferred', checked)}
                      />
                    </td>
                    <td className="p-2 border text-center">
                      <Checkbox
                        checked={task.isMandatory}
                        onCheckedChange={(checked) => handleTaskChange(index, 'isMandatory', checked)}
                      />
                    </td>
                    {['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].map((day) => (
                      <td key={day} className="p-2 border">
                        <Input
                          type="number"
                          value={task[day]}
                          onChange={(e) => handleTaskChange(index, day, e.target.value)}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end mt-6">
        <Button onClick={handleSubmit}>
          Submit Task Plan
        </Button>
      </div>
    </div>
  );
};

// Helper function to get week number
declare global {
  interface Date {
    getWeek(): number;
  }
}

Date.prototype.getWeek = function() {
  const d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
};

export default TaskPlanner;
