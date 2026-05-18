#include <iostream>
#include <queue>
#include <set>
#include <sstream>
#include <string>
#include <vector>

using namespace std;

static string joinInts(const vector<int>& arr) {
  ostringstream out;
  for (size_t i = 0; i < arr.size(); i++) {
    if (i) out << ",";
    out << arr[i];
  }
  return out.str();
}

static void bubbleSort(const vector<int>& input) {
  vector<int> a = input;
  cout << "Vector initial|" << joinInts(a) << "\n";
  for (size_t i = 0; i + 1 < a.size(); i++) {
    for (size_t j = 0; j + 1 < a.size() - i; j++) {
      cout << "Comparam " << a[j] << " si " << a[j + 1] << "|" << joinInts(a) << "\n";
      if (a[j] > a[j + 1]) {
        swap(a[j], a[j + 1]);
        cout << "Am facut interschimbarea|" << joinInts(a) << "\n";
      }
    }
  }
  cout << "Sortare finalizata|" << joinInts(a) << "\n";
}

static int partitionQS(vector<int>& a, int low, int high) {
  int pivot = a[high];
  int i = low - 1;
  for (int j = low; j < high; j++) {
    cout << "Comparam " << a[j] << " cu pivot " << pivot << "|" << joinInts(a) << "\n";
    if (a[j] <= pivot) {
      i++;
      swap(a[i], a[j]);
      cout << "Mutam elementul in partea stanga|" << joinInts(a) << "\n";
    }
  }
  swap(a[i + 1], a[high]);
  cout << "Plasam pivotul pe pozitia finala|" << joinInts(a) << "\n";
  return i + 1;
}

static void quickSortRec(vector<int>& a, int low, int high) {
  if (low < high) {
    int pi = partitionQS(a, low, high);
    quickSortRec(a, low, pi - 1);
    quickSortRec(a, pi + 1, high);
  }
}

static void quickSort(const vector<int>& input) {
  vector<int> a = input;
  cout << "Vector initial|" << joinInts(a) << "\n";
  if (!a.empty()) quickSortRec(a, 0, static_cast<int>(a.size()) - 1);
  cout << "Sortare finalizata|" << joinInts(a) << "\n";
}

static void bfs(char start) {
  vector<pair<char, vector<char>>> g = {
      {'A', {'B', 'C'}}, {'B', {'D', 'E'}}, {'C', {'F'}},
      {'D', {}},         {'E', {'F'}},      {'F', {}}};

  auto neighbors = [&](char node) {
    for (const auto& entry : g) {
      if (entry.first == node) return entry.second;
    }
    return vector<char>{};
  };

  queue<char> q;
  set<char> visited;
  string order;
  q.push(start);
  visited.insert(start);
  cout << "Pornim din nodul " << start << "|-\n";

  while (!q.empty()) {
    char node = q.front();
    q.pop();
    if (!order.empty()) order += ",";
    order += node;
    cout << "Vizitam nodul " << node << "|order:" << order << "\n";
    for (char nb : neighbors(node)) {
      if (!visited.count(nb)) {
        visited.insert(nb);
        q.push(nb);
        cout << "Adaugam vecinul " << nb << " in coada|order:" << order << "\n";
      }
    }
  }

  cout << "Parcurgere finalizata|order:" << order << "\n";
}

int main(int argc, char* argv[]) {
  if (argc < 2) {
    cerr << "Missing algorithm";
    return 1;
  }

  string algorithm = argv[1];
  if (algorithm == "bubbleSort" || algorithm == "quickSort") {
    vector<int> vals;
    for (int i = 2; i < argc; i++) vals.push_back(stoi(argv[i]));
    if (algorithm == "bubbleSort") bubbleSort(vals);
    if (algorithm == "quickSort") quickSort(vals);
    return 0;
  }

  if (algorithm == "bfs") {
    char start = 'A';
    if (argc >= 3 && argv[2][0] != '\0') start = argv[2][0];
    bfs(start);
    return 0;
  }

  cerr << "Unknown algorithm";
  return 1;
}
