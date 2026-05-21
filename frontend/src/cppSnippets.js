// Maps pseudoLine index → C++ line numbers (0-based) that should be highlighted
export const CPP_LINE_MAP = {
  bubbleSort: {
    0: [12],        // for(i = 1; i <= n - 1; i++)
    1: [13],        // for(j = 1; j <= n - i; j++)
    2: [14],        // if(a[j] > a[j + 1])
    3: [15]         // swap(a[j], a[j + 1])
  },
  selectionSort: {
    0: [12],        // for(i = 1; i <= n - 1; i++)
    1: [14],        // minIdx = i
    2: [15],        // for(j = i + 1; j <= n; j++)
    3: [16, 17],    // if(a[j] < a[minIdx]) { minIdx = j; }
    4: [18]         // swap(a[i], a[minIdx])
  },
  insertionSort: {
    0: [12],        // for(i = 2; i <= n; i++)
    1: [14],        // cheie = a[i]
    2: [15],        // j = i - 1
    3: [16],        // while(j >= 1 && a[j] > cheie)
    4: [18, 19],    // a[j+1] = a[j]; j--
    5: [21]         // a[j+1] = cheie
  },
  mergeSort: {
    0: [21],        // if(st < dr)
    1: [23],        // int mij = (st + dr) / 2
    2: [24],        // mergesort(st, mij)
    3: [25],        // mergesort(mij + 1, dr)
    4: [8, 9, 10, 11, 12, 13, 14, 15, 16]  // interclaseaza body
  },
  quickSort: {
    0: [8],         // int p = a[dr], k = st - 1
    1: [9],         // for(j = st; j < dr; j++)
    2: [11, 13, 14],// if(a[j] <= p) { k++; swap; }
    3: [17],        // swap(a[k + 1], a[dr])
    4: [26, 27]     // quicksort recursiv x2
  },
  linearSearch: {
    0: [11],        // rezultat = -1
    1: [12],        // for(i = 1; i <= n; i++)
    2: [13, 14, 15, 16], // if(a[i] == tinta) { rezultat = i; break; }
    3: [19, 20, 21] // if/else cout
  },
  binarySearch: {
    0: [12, 13],    // st = 1; dr = n
    1: [16],        // while(st <= dr)
    2: [18],        // mij = (st + dr) / 2
    3: [19, 21],    // if(a[mij] == tinta) { rezultat = mij; }
    4: [24, 25],    // else if(a[mij] < tinta) { st = mij + 1; }
    5: [26, 27]     // else { dr = mij - 1; }
  },
  heapSort: {
    0: [3, 4, 5, 6, 7, 8, 9],  // heapify body
    1: [3, 8, 9],               // swap in heapify
    2: [14],                    // build heap loop
    3: [17],                    // swap a[1] with a[i]
    4: [18]                     // heapify call
  },
  countingSort: {
    0: [11, 12],   // count loop
    1: [13],       // output comment
    2: [14, 15]    // output loop
  },
  euclid: {
    0: [6],        // while(b != 0)
    1: [7],        // r = a % b
    2: [8, 9],     // a = b; b = r
    4: [11]        // cout << a
  },
  isPrime: {
    0: [6, 7],     // if(n < 2) prim = false
    1: [8],        // for(d = 2; d*d <= n; d++)
    2: [9, 10],    // if(n % d == 0) { prim = false; break; }
    3: [12, 13]    // if(prim) cout << "PRIM"
  },
  sieve: {
    0: [7],        // for init
    1: [8],        // for i=2
    2: [9],        // if(ciur[i])
    3: [11],       // ciur[j] = 0
    5: [13, 14]    // output
  },
  bfs: {
    0: [19, 20],    // c[1] = s; viz[s] = 1
    3: [23, 24],    // x = c[st]; st++
    5: [29, 30, 31] // viz[i] = 1; dr++; c[dr] = i
  },
  dfs: {
    0: [26],        // dfs(s) — apel initial
    3: [9, 10],     // viz[nod] = 1; cout << nod
    5: [13]         // dfs(i) — apel recursiv vecin
  }
};

export const CPP_SNIPPETS = {
  bubbleSort:
`#include <iostream>

using namespace std;

int n, i, j, a[1001];

int main()
{
    cin >> n;
    for(i = 1; i <= n; i++)
        cin >> a[i];

    for(i = 1; i <= n - 1; i++)
        for(j = 1; j <= n - i; j++)
            if(a[j] > a[j + 1])
                swap(a[j], a[j + 1]);

    for(i = 1; i <= n; i++)
        cout << a[i] << " ";
    return 0;
}`,

  selectionSort:
`#include <iostream>

using namespace std;

int n, i, j, a[1001], minIdx;

int main()
{
    cin >> n;
    for(i = 1; i <= n; i++)
        cin >> a[i];

    for(i = 1; i <= n - 1; i++)
    {
        minIdx = i;
        for(j = i + 1; j <= n; j++)
            if(a[j] < a[minIdx])
                minIdx = j;
        swap(a[i], a[minIdx]);
    }

    for(i = 1; i <= n; i++)
        cout << a[i] << " ";
    return 0;
}`,

  insertionSort:
`#include <iostream>

using namespace std;

int n, i, j, a[1001];

int main()
{
    cin >> n;
    for(i = 1; i <= n; i++)
        cin >> a[i];

    for(i = 2; i <= n; i++)
    {
        int cheie = a[i];
        j = i - 1;
        while(j >= 1 && a[j] > cheie)
        {
            a[j + 1] = a[j];
            j--;
        }
        a[j + 1] = cheie;
    }

    for(i = 1; i <= n; i++)
        cout << a[i] << " ";
    return 0;
}`,

  mergeSort:
`#include <iostream>

using namespace std;

int n, i, a[1001], b[1001];

void interclaseaza(int st, int mij, int dr)
{
    int i = st, j = mij + 1, k = st;
    while(i <= mij && j <= dr)
    {
        if(a[i] <= a[j]) b[k++] = a[i++];
        else             b[k++] = a[j++];
    }
    while(i <= mij) b[k++] = a[i++];
    while(j <= dr)  b[k++] = a[j++];
    for(i = st; i <= dr; i++) a[i] = b[i];
}

void mergesort(int st, int dr)
{
    if(st < dr)
    {
        int mij = (st + dr) / 2;
        mergesort(st, mij);
        mergesort(mij + 1, dr);
        interclaseaza(st, mij, dr);
    }
}

int main()
{
    cin >> n;
    for(i = 1; i <= n; i++)
        cin >> a[i];
    mergesort(1, n);
    for(i = 1; i <= n; i++)
        cout << a[i] << " ";
    return 0;
}`,

  quickSort:
`#include <iostream>

using namespace std;

int n, i, j, a[1001];

int partitie(int st, int dr)
{
    int p = a[dr], k = st - 1;
    for(j = st; j < dr; j++)
    {
        if(a[j] <= p)
        {
            k++;
            swap(a[k], a[j]);
        }
    }
    swap(a[k + 1], a[dr]);
    return k + 1;
}

void quicksort(int st, int dr)
{
    if(st < dr)
    {
        int m = partitie(st, dr);
        quicksort(st, m - 1);
        quicksort(m + 1, dr);
    }
}

int main()
{
    cin >> n;
    for(i = 1; i <= n; i++)
        cin >> a[i];
    quicksort(1, n);
    for(i = 1; i <= n; i++)
        cout << a[i] << " ";
    return 0;
}`,

  linearSearch:
`#include <iostream>

using namespace std;

int n, tinta, i, a[1001], rezultat;

int main()
{
    cin >> n >> tinta;
    for(i = 1; i <= n; i++)
        cin >> a[i];
    rezultat = -1;
    for(i = 1; i <= n; i++)
        if(a[i] == tinta)
        {
            rezultat = i;
            break;
        }
    if(rezultat != -1)
        cout << "Gasit la pozitia " << rezultat;
    else
        cout << "Negasit";
    return 0;
}`,

  binarySearch:
`#include <iostream>

using namespace std;

int n, tinta, st, dr, mij, a[1001], rezultat;

int main()
{
    cin >> n >> tinta;
    for(int i = 1; i <= n; i++)
        cin >> a[i];

    st = 1;
    dr = n;
    rezultat = -1;

    while(st <= dr)
    {
        mij = (st + dr) / 2;
        if(a[mij] == tinta)
        {
            rezultat = mij;
            break;
        }
        else if(a[mij] < tinta)
            st = mij + 1;
        else
            dr = mij - 1;
    }

    if(rezultat != -1)
        cout << "Gasit la pozitia " << rezultat;
    else
        cout << "Negasit";
    return 0;
}`,

  heapSort:
`#include <iostream>

using namespace std;

void heapify(int a[], int n, int i)
{
    int mx = i, st = 2*i, dr = 2*i+1;
    if(st <= n && a[st] > a[mx]) mx = st;
    if(dr <= n && a[dr] > a[mx]) mx = dr;
    if(mx != i) { swap(a[i], a[mx]); heapify(a, n, mx); }
}

void heapsort(int a[], int n)
{
    for(int i = n/2; i >= 1; i--) heapify(a, n, i);
    for(int i = n; i >= 2; i--)
    {
        swap(a[1], a[i]);
        heapify(a, i-1, 1);
    }
}

int main()
{
    int n, a[1001];
    cin >> n;
    for(int i = 1; i <= n; i++) cin >> a[i];
    heapsort(a, n);
    for(int i = 1; i <= n; i++) cout << a[i] << " ";
    return 0;
}`,

  countingSort:
`#include <iostream>

using namespace std;

int n, a[101], f[1001], mx, i;

int main()
{
    cin >> n;
    for(i = 1; i <= n; i++) { cin >> a[i]; f[a[i]]++; if(a[i]>mx) mx=a[i]; }
    for(i = 0; i <= mx; i++) while(f[i]--) cout << i << " ";
    return 0;
}`,

  euclid:
`#include <iostream>

using namespace std;

int a, b, r;

int main()
{
    cin >> a >> b;
    while(b != 0)
    {
        r = a % b;
        a = b;
        b = r;
    }
    cout << a;
    return 0;
}`,

  isPrime:
`#include <iostream>

using namespace std;

int n, d;

int main()
{
    bool prim = true;
    cin >> n;
    if(n < 2) prim = false;
    for(d = 2; d*d <= n; d++)
        if(n % d == 0) { prim = false; break; }
    if(prim) cout << "PRIM";
    else     cout << "NU";
    return 0;
}`,

  sieve:
`#include <iostream>

using namespace std;

int n, ciur[1001], i, j;

int main()
{
    cin >> n;
    for(i = 2; i <= n; i++) ciur[i] = 1;
    for(i = 2; i*i <= n; i++)
        if(ciur[i])
            for(j = i*i; j <= n; j += i)
                ciur[j] = 0;
    for(i = 2; i <= n; i++)
        if(ciur[i]) cout << i << " ";
    return 0;
}`,

  bfs:
`#include <iostream>

using namespace std;

int n, m, a[105][105], viz[105], c[105];
int st, dr, i, x, y, s;

int main()
{
    cin >> n >> m;
    for(i = 1; i <= m; i++)
    {
        cin >> x >> y;
        a[x][y] = 1;
        a[y][x] = 1;
    }
    cin >> s;
    st = 1;
    dr = 1;
    c[1] = s;
    viz[s] = 1;
    while(st <= dr)
    {
        x = c[st];
        st++;
        cout << x << " ";
        for(i = 1; i <= n; i++)
            if(a[x][i] == 1 && viz[i] == 0)
            {
                viz[i] = 1;
                dr++;
                c[dr] = i;
            }
    }
    return 0;
}`,

  dfs:
`#include <iostream>

using namespace std;

int n, m, a[105][105], viz[105];
int i, x, y, s;

void dfs(int nod)
{
    viz[nod] = 1;
    cout << nod << " ";
    for(i = 1; i <= n; i++)
        if(a[nod][i] == 1 && viz[i] == 0)
            dfs(i);
}

int main()
{
    cin >> n >> m;
    for(i = 1; i <= m; i++)
    {
        cin >> x >> y;
        a[x][y] = 1;
        a[y][x] = 1;
    }
    cin >> s;
    dfs(s);
    return 0;
}`
};
