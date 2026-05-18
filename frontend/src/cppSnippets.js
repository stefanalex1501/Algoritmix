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
  quickSort: {
    0: [8],         // int p = a[dr], k = st - 1
    1: [9],         // for(j = st; j < dr; j++)
    2: [11, 13, 14],// if(a[j] <= p) { k++; swap; }
    3: [17],        // swap(a[k + 1], a[dr])
    4: [26, 27]     // quicksort recursiv x2
  },
  binarySearch: {
    0: [12, 13],    // st = 1; dr = n
    1: [16],        // while(st <= dr)
    2: [18],        // mij = (st + dr) / 2
    3: [19, 21],    // if(a[mij] == tinta) { rezultat = mij; }
    4: [24, 25],    // else if(a[mij] < tinta) { st = mij + 1; }
    5: [26, 27]     // else { dr = mij - 1; }
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
