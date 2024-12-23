#include <iostream>

using namespace std;

int how_old(int current_year, int birth_year) {
    return current_year - birth_year;
}

int main() {
    cout << "You are..." << endl;
    int age = how_old(2024, 1994);
    cout << age << " years old" << endl;
    return 0;
}