import { useState, useEffect, useRef } from 'react';
// @ts-ignore
import style from './Cashier.module.css';
// @ts-ignore
import styles from './Reports.module.css';
import FontSizeSlider from './FontSizeSlider';
import setFontSize from './fontSizeUtility';
import { useNavigate } from 'react-router-dom';
import SalesLineGraph from './SalesLineGraph';

const serverAddress = 'https://shareteaapi.onrender.com';
// const serverAddress = 'http://localhost:8080';

const Header = () => {
    // Flag to ensure the useEffect runs only once
    const hasEffectRun = useRef(false);
  
    /**
     * Initializes the Google Translate element.
     *
     * @ignore
     * @function
     * @returns {void}
     */
    const googleTranslateElementInit = () => {
      // @ts-ignore
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          autoDisplay: false,
        },
        "google_translate_element"
      );
    };
  
    useEffect(() => {
      // Run only once to initialize Google Translate script
      if (!hasEffectRun.current) {
        console.log('rendered translate once');
        // Dynamically add Google Translate script to the document
        var addScript = document.createElement("script");
        addScript.setAttribute(
          "src",
          "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        );
        document.body.appendChild(addScript);
        // @ts-ignore
        window.googleTranslateElementInit = googleTranslateElementInit;
  
        // Update the flag to indicate that the effect has run
        hasEffectRun.current = true;
      }
    }, []);
  
    const navigate = useNavigate();
  
    // State for controlling font size
    // @ts-ignore
    const [fontSize, setFontSizeState] = useState<number>(16);
  
    /**
     * Handles the change in font size and updates the state.
     *
     * @param {number} newFontSize - The new font size value.
     * @returns {void}
     */
    const handleFontSizeChange = (newFontSize: number): void => {
      setFontSizeState(newFontSize);
      // Call external setFontSize function with the new font size
      setFontSize(newFontSize);
    };
  
    return (
      <div className={style.navContainer}>
        <div className={style.accOptions}>
          <div className={style.slideContainer}>
            <h4>Text Size</h4>
            {/* Font size slider component */}
            <FontSizeSlider onFontSizeChange={handleFontSizeChange} />
          </div>
          {/* Google Translate element container */}
          <div id="google_translate_element" className={style.translateButton}></div>
        </div>
        <div className={style.navOptions}>
          {/* Exit button */}
          <button className={style.exitButton} onClick={() => navigate("/cashier")}>
            Exit
          </button>
        </div>
      </div>
    );
  }

const Reports = () => {
    const [selectedOption, setSelectedOption] = useState<'salesReport' | 'restockReport' | 'soldTogether'>('salesReport');
    const [startDay, setStartDay] = useState<string>('');
    const [startMonth, setStartMonth] = useState<string>('');
    const [startYear, setStartYear] = useState<string>('');
    const [endDay, setEndDay] = useState<string>('');
    const [endMonth, setEndMonth] = useState<string>('');
    const [endYear, setEndYear] = useState<string>('');
    const [drinkId, setDrinkId] = useState<number | null>(null);
    const [startMonthSoldTogether, setStartMonthSoldTogether] = useState<string>('');
    const [startDaySoldTogether, setStartDaySoldTogether] = useState<string>('');
    const [startYearSoldTogether, setStartYearSoldTogether] = useState<string>('');
    const [endMonthSoldTogether, setEndMonthSoldTogether] = useState<string>('');
    const [endDaySoldTogether, setEndDaySoldTogether] = useState<string>('');
    const [endYearSoldTogether, setEndYearSoldTogether] = useState<string>('');
    const [soldTogetherData, setSoldTogetherData] = useState<any[] | null>(null);
    const [salesReportData, setSalesReportData] = useState<Map<string, number>>(new Map());
    const [restockReportData, setRestockReportData] = useState<any[] | null>(null);


  const handleMenuClick = (option: 'salesReport' | 'restockReport' | 'soldTogether') => {
    setSelectedOption(option);
    if (option === 'restockReport') {
        fetchRestockReportData();
    }
  };

  const fetchData = async (url: string) => {
    try {
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  };

  const handleSelectClick = async () => {
    try {
      const startDate = `${startYear}-${startMonth.padStart(2, '0')}-${startDay.padStart(2, '0')}`;
      const endDate = `${endYear}-${endMonth.padStart(2, '0')}-${endDay.padStart(2, '0')}`;
      const url = `${serverAddress}/db/report/sales/${startDate}/${endDate}/${drinkId}`;
      console.log(url);
      const data = await fetchData(url);
  
      // Convert the date to a string and keep the value as an integer
      const salesMap = new Map(Object.entries(data).map(([date, value]) => [date, Number(value)]));
  
      setSalesReportData(salesMap);
    } catch (error) {
      console.error('Error fetching sales report data:', error);
    }
  };

  const fetchRestockReportData = async () => {
    try {
      const url = `${serverAddress}/db/report/restockTable`;
      const data = await fetchData(url);
      setRestockReportData(data);
    } catch (error) {
      console.error('Error fetching restock report data:', error);
    }
  };

  const handleSoldTogetherClick = async () => {
    try {
      const startDate = `${startYearSoldTogether}-${startMonthSoldTogether.padStart(2, '0')}-${startDaySoldTogether.padStart(2, '0')}`;
      const endDate = `${endYearSoldTogether}-${endMonthSoldTogether.padStart(2, '0')}-${endDaySoldTogether.padStart(2, '0')}`;
  
      const url = `${serverAddress}/db/report/pair/${startDate}/${endDate}`;
      const data = await fetchData(url);
      
      setSoldTogetherData(data);
    } catch (error) {
      console.error('Error fetching sold together report data:', error);
    }
  };
  
  
  const handleRestockClick = async () => {
    try {
      if (restockReportData && restockReportData.length > 0) {
        const promises = restockReportData.map(async (entry) => {
          const inventoryItemId = entry[0];
          const currentStock = Number(entry[2]);
          const stockChange = 100 - currentStock;
  
          const url = `${serverAddress}/db/inventory/changeStock/${inventoryItemId}/${stockChange}`;
          await fetch(url, { method: 'POST' });
        });
  
        await Promise.all(promises);
  
        fetchRestockReportData();
      }
    } catch (error) {
      console.error('Error restocking inventory:', error);
    }
  };

  return (
    <div className={styles.reportsContainer}>
      <Header/>
      <div className={styles.menuBar}>
        <button
          className={`${styles.menuItem} ${selectedOption === 'salesReport' ? styles.active : ''}`}
          onClick={() => handleMenuClick('salesReport')}
        >
          Sales Report
        </button>
        <button
          className={`${styles.menuItem} ${selectedOption === 'restockReport' ? styles.active : ''}`}
          onClick={() => handleMenuClick('restockReport')}
        >
          Restock Report
        </button>
        <button
          className={`${styles.menuItem} ${selectedOption === 'soldTogether' ? styles.active : ''}`}
          onClick={() => handleMenuClick('soldTogether')}
        >
          Sold Together
        </button>
      </div>

      <div className={styles.mainContent}>
        {selectedOption === 'salesReport' && (
          <div className={styles.mainContent}>
            <h2 className={styles.sectionTitle}>Sales Report</h2>
            <div className={styles.dateInputContainer}>
              <label>Start Date</label>
                <div className = {styles.inputCont}>
                  <input
                    type="number"
                    placeholder="Day"
                    value={startDay}
                    onChange={(e) => setStartDay(e.target.value)}
                    className={styles.dateInput}
                  />
                  <input
                    type="number"
                    placeholder="Month"
                    value={startMonth}
                    onChange={(e) => setStartMonth(e.target.value)}
                    className={styles.dateInput}
                  />
                  <input
                    type="number"
                    placeholder="Year"
                    value={startYear}
                    onChange={(e) => setStartYear(e.target.value)}
                    className={styles.dateInput}
                  />
                </div>
            </div>
            <div className={styles.dateInputContainer}>
              <label>End Date</label>
              <div className = {styles.inputCont}>
                <input
                  type="number"
                  placeholder="Day"
                  value={endDay}
                  onChange={(e) => setEndDay(e.target.value)}
                  className={styles.dateInput}
                />
                <input
                  type="number"
                  placeholder="Month"
                  value={endMonth}
                  onChange={(e) => setEndMonth(e.target.value)}
                  className={styles.dateInput}
                />
                <input
                  type="number"
                  placeholder="Year"
                  value={endYear}
                  onChange={(e) => setEndYear(e.target.value)}
                  className={styles.dateInput}
                />
              </div>
            </div>
            <div className={styles.dateInputContainer}>
              <label>Drink ID: </label>
              <div className = {styles.inputCont}>
                <input
                  type="number"
                  value={drinkId || ''}
                  onChange={(e) => setDrinkId(Number(e.target.value))}
                  className={styles.dateInput}
                />
              </div>
            </div>
            <button className={styles.selectButton} onClick={handleSelectClick}>
              Enter
            </button>

            {salesReportData && (
              <div>
                <SalesLineGraph salesReportData={salesReportData} />
              </div>
            )}
          </div>
        )}

        {selectedOption === 'restockReport' && (
          <div className={styles.restockContainer}>
            <h2 className={styles.sectionTitle}>Restock Report</h2>
            {restockReportData && restockReportData.length > 0 ? (
              <div className={styles.tableContainer}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Product Name</th>
                      <th>Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {restockReportData.map((entry, index) => (
                      <tr key={index}>
                        <td>{entry[0]}</td>
                        <td>{entry[1]}</td>
                        <td>{entry[2]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className={styles.noDataMessage}>No Ingredients Require Restocking</p>
            )}
            <button className={styles.restockButton} onClick={handleRestockClick}>
              Restock
            </button>
          </div>
        )}

        {selectedOption === 'soldTogether' && (
          <div className={styles.soldTogetherContainer}>
            <h2 className={styles.sectionTitle}>Sold Together Report</h2>
            <div className={styles.dateInputContainer}>
              <label>Start Date</label>
              <div className = {styles.inputCont}>
                <input
                  type="number"
                  placeholder="Day"
                  value={startDaySoldTogether}
                  onChange={(e) => setStartDaySoldTogether(e.target.value)}
                  className={styles.dateInput}
                />
                <input
                  type="number"
                  placeholder="Month"
                  value={startMonthSoldTogether}
                  onChange={(e) => setStartMonthSoldTogether(e.target.value)}
                  className={styles.dateInput}
                />
                <input
                  type="number"
                  placeholder="Year"
                  value={startYearSoldTogether}
                  onChange={(e) => setStartYearSoldTogether(e.target.value)}
                  className={styles.dateInput}
                />
              </div>
            </div>
            <div className={styles.dateInputContainer}>
              <label>End Date</label>
              <div className = {styles.inputCont}>
                <input
                  type="number"
                  placeholder="Day"
                  value={endDaySoldTogether}
                  onChange={(e) => setEndDaySoldTogether(e.target.value)}
                  className={styles.dateInput}
                />
                <input
                  type="number"
                  placeholder="Month"
                  value={endMonthSoldTogether}
                  onChange={(e) => setEndMonthSoldTogether(e.target.value)}
                  className={styles.dateInput}
                />
                <input
                  type="number"
                  placeholder="Year"
                  value={endYearSoldTogether}
                  onChange={(e) => setEndYearSoldTogether(e.target.value)}
                  className={styles.dateInput}
                />
              </div>
            </div>

            <button className={styles.selectButton} onClick={handleSoldTogetherClick}>
              Enter
            </button>

            {soldTogetherData && soldTogetherData.length > 0 ? (
              <div className={styles.tableContainer}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Drink 1</th>
                      <th>Drink 2</th>
                      <th>Times Bought Together</th>
                    </tr>
                  </thead>
                  <tbody>
                    {soldTogetherData.map((entry, index) => (
                      <tr key={index} className={styles.dataRow}>
                        <td>{entry[1]}</td>
                        <td>{entry[2]}</td>
                        <td>{entry[0]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className={styles.noDataMessage}>No sold together data available.</p>
            )}

          </div>
        )}

      </div>
    </div>
  );
};

export default Reports;

