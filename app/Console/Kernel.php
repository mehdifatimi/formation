<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use App\Models\User;

class Kernel extends ConsoleKernel
{
    protected $commands = [
        Commands\RunSeeders::class,
    ];

    protected function schedule(Schedule $schedule): void
    {
        // $schedule->command('inspire')->hourly();
    }

    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');

        User::where('email', 'ali123@gmail.com')->first();

        $user = User::where('email', 'ali123@gmail.com')->first();
        $user->password = bcrypt('ali123');
        $user->save();

        User::create([
            'name' => 'ali',
            'email' => 'ali123@gmail.com',
            'password' => bcrypt('ali123'),
            'role' => 'user'
        ]);
    }
} 