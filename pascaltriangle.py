import matplotlib.pyplot as plt
def generate_pascals_triangle(n):
    triangle = []
    for i in range (n):
        row = [1]
        for j in range(1,i):
            row.append(triangle[i-1][j-1] + triangle[i-1][j])
        if i > 0:
            row.append(1)
        triangle.append(row)
        return triangle
def plot_coloured_triangle(n_rows=26):
    triangle = generate_pascals_triangle(n_rows)
    fig, ax = plt.subplots(figsize = (10, 10), facecolor='black')
    ax.set_facecolor('black')
    ax.axis('off')
    for i, row in enumerate(triangle):
        x_offset = (n_rows - i) / 2
        for j, num in enumerate(row):
            color = 'orange' if num%2 == 0 else 'white'
        ax.text(x_offset + j*1.1, -i, str(num), color=color, fontsize=8, ha='center', va='center')
    plt.tight_layout()
    plt.show()
if __name__ == "__main__":
    plot_coloured_triangle(26)
    print("Pascal's Triangle with 26 rows has been plotted.")