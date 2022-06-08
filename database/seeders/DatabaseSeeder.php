<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // \App\Models\User::factory(10)->create();

        // $this->call(CategorySeeder::class);

        User::create([
            'name' => 'Super Admin',
            'email' => 'super_admin@gmail.com',
            'password' => Hash::make(12345678)
        ]);

        Category::factory(10)->create();
    }
}
