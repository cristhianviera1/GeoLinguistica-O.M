import json
import numpy as np
from matplotlib import pyplot as plt


file_path = "./geojson_files/encuesta.geojson"
geojson_file = open(file_path, 'r', encoding='utf-8')
data = json.load(geojson_file)

def reduce_decimals(coordinates):
    joined = []
    _ = [joined.append(_c[:]) for _a in coordinates for _b in _a for _c in _b]
    return [[float("%.12f" % _x), float("%.12f" % _y)] for _x, _y in joined]

def reduce_polygon(polygon, angle_th=0, distance_th=0):
    angle_th_rad = np.deg2rad(angle_th)
    points_removed = [0]
    while len(points_removed):
        points_removed = list()
        for i in range(0, len(polygon)-2, 2):
            v01 = polygon[i-1] - polygon[i]
            v12 = polygon[i] - polygon[i+1]
            d01 = np.linalg.norm(v01)
            d12 = np.linalg.norm(v12)
            if d01 < distance_th and d12 < distance_th:
                points_removed.append(i)
                continue
            angle = np.arccos(np.sum(v01*v12) / (d01 * d12))
            if angle < angle_th_rad:
                    points_removed.append(i)
        polygon = np.delete(polygon, points_removed, axis=0)
    return polygon
    

for _index, _feature in enumerate(data["features"]):
    reduced_decimals = reduce_decimals(_feature["geometry"]["coordinates"])[0]
    reduced_polygon = reduce_polygon(reduced_decimals, angle_th=5000, distance_th=5000)
    plt.figure()
    plt.scatter(reduced_decimals[:, 0], reduced_decimals[:, 1], c='r', marker='o', s=2)
    plt.scatter(reduced_polygon[:, 0], reduced_polygon[:, 1], c='b', marker='x', s=20)
    plt.plot(reduced_polygon[:, 0], reduced_polygon[:, 1], c='black', linewidth=1)
    plt.show()

    data["features"][_index]["geometry"]["coordinates"] = reduced_polygon.tolist()

    print(
        f'original_polygon length: {len(reduced_decimals)}\n',
        f'reduced_polygon length: {len(reduced_polygon)}'
    )

# Writing to sample.json
with open("./my_new.json", "w") as outfile:
    outfile.write(json.dumps(data))