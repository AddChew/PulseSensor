# Pulse Sensor (Kiosk)
Pulse Sensor is a client side single page web application, providing sentiment analysis services for employee pulse surveys.

## Installation Instructions
This set of instructions assumes that you already have anaconda prompt installed on your computer.
1. Download the zipped folder containing the source code from kiosk branch (Click on Code and then Download ZIP).
2. Unzip the zipped folder.
3. Launch anaconda prompt.
4. Navigate to where the unzipped folder is. For example, if your unzipped folder is in Downloads directory, then run the following commands in anaconda prompt:
```
cd downloads
cd PulseSensor-kiosk
```
5. Create a new Python environment by running the following commands in anaconda prompt:
```
conda create -n pulse-sensor python=3.7
conda activate pulse-sensor
```
6. Install the required dependencies by running the following command in anaconda prompt (This might take a while):
```
pip install -r requirements.txt
```

## Usage Instructions
1. Navigate to app folder in PulseSensor-kiosk folder by running the following command in anaconda prompt:
```
cd app
```
2. Launch PulseSensor by running the following command in anaconda prompt:
```
python app.py
```
3. Upload CSV file containing the text that you want to analyse and follow the on screen instructions. You can test PulseSensor with the following test files found [here](https://drive.google.com/drive/folders/1YJgSY8qjgpMvULbsq-8tcM8EYvYLdkWJ?usp=sharing).
