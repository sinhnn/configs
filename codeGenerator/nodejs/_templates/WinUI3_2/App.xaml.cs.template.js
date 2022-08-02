`
using Microsoft.EntityFrameworkCore;
using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Media.Animation;
using System.IO;
using Windows.ApplicationModel;
using Windows.Globalization;
using Windows.Storage;

${databases.map(database => `
using ${projectName}.${database.name}.Views;
using ${projectName}.${database.name}.ViewModels;
using ${projectName}.${database.name}.Models;
using ${projectName}.${database.name}.Repository;
using ${projectName}.${database.name}.Repository.Sql;
`).join("")}

namespace ${context.namespace}
{
    /// <summary>
    /// Provides application-specific behavior to supplement the default Application class.
    /// </summary>
    public partial class App : Application
    {

        /// <summary>
        /// Gets main App Window
        /// </summary>
        public static Window Window { get { return m_window; } }
        private static Window m_window;

        /// <summary>
        /// Gets the app-wide MainViewModel singleton instance.
        /// </summary>


        /// <summary>
        /// Pipeline for interacting with backend service or database.
        /// </summary>
        ${databases.map(database => `
            public static ${database.name}.Repository.I${database.name}Repository _${database.name.ToVariableName()}Repository { get; private set; }
            ${database.tables.map(table => {return `public static ${database.name}.ViewModels.${table.entityName}MainViewModel ${table.entityName.ToVariableName()}MainViewModel { get; } = new ${database.name}.ViewModels.${table.entityName}MainViewModel();`}).join("")}
        `
        ).join("\n")}

        /// <summary>
        /// Initializes the singleton application object.  This is the first line of authored code
        /// executed, and as such is the logical equivalent of main() or WinMain().
        /// </summary>
        public App() => InitializeComponent();

        /// <summary>
        /// Invoked when the application is launched normally by the end user.
        /// </summary>
        protected override void OnLaunched(LaunchActivatedEventArgs e)
        {
            m_window = new MainWindow();

            // Prepare the app shell and window content.
            AppShell shell = m_window.Content as AppShell ?? new AppShell();
            shell.Language = ApplicationLanguages.Languages[0];
            m_window.Content = shell;
            Use${database.name}();
            if (shell.AppFrame.Content == null)
            {
                // When the navigation stack isn't restored, navigate to the first page
                // suppressing the initial entrance animation.
                shell.AppFrame.Navigate(typeof(${tables[0].entityName}ListPage), null,
                    new SuppressNavigationTransitionInfo());
            }

            m_window.Activate();
        }

        /// <summary>
        /// Configures the app to use the Sqlite data source. If no existing Sqlite database exists, 
        /// loads a demo database filled with fake data so the app has content.
        /// </summary>
        public static void Use${database.name}()
        {
            string databasePath = "${database.source}";
            var dbOptions = new DbContextOptionsBuilder<${database.name}Context>().UseSqlite(
                "Data Source=" + databasePath);
            _${database.name.ToVariableName()}Repository = new Sql${database.name}Repository(dbOptions);
            ${tables.map(table => {return `
            ${table.entityName.ToVariableName()}MainViewModel.Repository = _${database.name.ToVariableName()}Repository.${table.codeName};
            ${table.entityName.ToVariableName()}MainViewModel.LoadAll();
            `
            }).join("")}
        }

        /// <summary>
        /// Configures the app to use the REST data source. For convenience, a read-only source is provided. 
        /// You can also deploy your own copy of the REST service locally or to Azure. See the README for details.
        /// </summary>
        //public static void UseRest() =>
        //    Repository = new Rest${database.name}Repository($"{Constants.ApiUrl}/api/");
    }
}
`