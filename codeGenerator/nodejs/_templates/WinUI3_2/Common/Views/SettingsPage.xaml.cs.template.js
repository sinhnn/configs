`
using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using System;
using System.IO;
using Windows.System;



namespace ${context.namespace}
{

    public sealed partial class SettingsPage : Page
    {
        // string s = Settings.Default.username;
        /// <summary>
        /// Restore default settings file
        /// </summary>
        public const string DataSourceKey = "data_source";
        /// <summary>
        /// Initializes a new instance of the SettingsPage class.
        /// </summary>
        public SettingsPage()
        {
            InitializeComponent();
            SqliteRadio.IsChecked = true;
            //if (App.Repository.GetType() == typeof(SqlContosoRepository))
            //{
            //    SqliteRadio.IsChecked = true;
            //}
            //else
            //{
            //    RestRadio.IsChecked = true;
            //}
        }

        /// <summary>
        /// Changes the app's data source.
        /// </summary>
        private void OnDataSourceChanged(object sender, RoutedEventArgs e)
        {
            //var radio = (RadioButton)sender;
            //switch (radio.Tag)
            //{
            //    case "Sqlite": App.UseSqlite(); break;
            //    case "Rest": App.UseRest(); break;
            //    default: throw new NotImplementedException();
            //}
            //ApplicationData.Current.LocalSettings.Values[DataSourceKey] = radio.Tag;
        }

        /// <summary>
        ///  Launches the privacy statement in the user's default browser.
        /// </summary>
        private async void OnPrivacyButtonClick(object sender, RoutedEventArgs e)
        {
            await Launcher.LaunchUriAsync(new Uri("https://go.microsoft.com/fwlink/?LinkId=521839"));
        }

        /// <summary>
        /// Launches the license terms in the user's default browser.
        /// </summary>
        private async void OnLicenseButtonClick(object sender, RoutedEventArgs e)
        {
            await Launcher.LaunchUriAsync(new Uri("https://go.microsoft.com/fwlink/?LinkId=822631"));
        }

        /// <summary>
        /// Launches the sample's GitHub page in the user's default browser.
        /// </summary>
        private async void OnCodeButtonClick(object sender, RoutedEventArgs e)
        {
            await Launcher.LaunchUriAsync(new Uri("https://github.com/Microsoft/Windows-appsample-customers-orders-database"));
        }

        private void OnButtonSaveClick(object sender, RoutedEventArgs e) {
            // System.Windows.Forms.MessageBox.Show("save new user" + settingUserName.Text);
            Settings.Default.Save();
        }
    }
}
`