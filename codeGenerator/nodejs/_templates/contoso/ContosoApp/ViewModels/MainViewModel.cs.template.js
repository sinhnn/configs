
fsCustom.writeFileSync(generatedFileConfig.outFilePath,
`
using CommunityToolkit.WinUI;
using Microsoft.UI.Dispatching;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading.Tasks;

namespace Contoso.App.ViewModels
{
    /// <summary>
    /// Provides data and commands accessible to the entire app.  
    /// </summary>
    public class MainViewModel : BindableBase
    {
        private DispatcherQueue dispatcherQueue = DispatcherQueue.GetForCurrentThread();

        /// <summary>
        /// Creates a new MainViewModel.
        /// </summary>
        public MainViewModel() {
            Task.Run(async() => {${tables.map(table => `
                await Get${table.modelName}ListAsync();`
                ).join("")}
            });
        }

        ${tables.map(table => `
        /// <summary>
        /// The collection of ${table.modelName}s in the list. 
        /// </summary>
        public ObservableCollection<${table.modelName}ViewModel> ${table.modelName}s { get; }
            = new ObservableCollection<${table.modelName}ViewModel>();

        private ${table.modelName}ViewModel _selected${table.modelName};

        /// <summary>
        /// Gets or sets the selected ${table.modelName}, or null if no ${table.modelName} is selected. 
        /// </summary>
        public ${table.modelName}ViewModel Selected${table.modelName}
        {
            get => _selected${table.modelName};
            set => Set(ref _selected${table.modelName}, value);
        }

        // private List<${table.modelName}ViewModel> _selected${table.modelName}s;
        /// <summary>
        /// Gets or sets the selected ${table.modelName}s, or null if no ${table.modelName}s is selected. 
        /// </summary>
        // public List<${table.modelName}ViewModel> Selected${table.modelName}s
        // {
        //     get => _selected${table.modelName}s;
        // }


        private bool _is${table.modelName}Loading = false;

        /// <summary>
        /// Gets or sets a value indicating whether the ${table.modelName}s list is currently being updated. 
        /// </summary>
        public bool Is${table.modelName}Loading
        {
            get => _is${table.modelName}Loading;
            set => Set(ref _is${table.modelName}Loading, value);
        }

        /// <summary>
        /// Gets the complete list of ${table.modelName}s from the database.
        /// </summary>
        public async Task Get${table.modelName}ListAsync()
        {
            await dispatcherQueue.EnqueueAsync(() => Is${table.modelName}Loading = true);

            var ${table.modelName.toLowerCase()}s = await App.Repository.${table.modelName}s.GetAsync();
            if (${table.modelName.toLowerCase()}s == null)
            {
                return;
            }

            await dispatcherQueue.EnqueueAsync(() =>
            {
                ${table.modelName}s.Clear();
                foreach (var c in ${table.modelName.toLowerCase()}s)
                {
                    ${table.modelName}s.Add(new ${table.modelName}ViewModel(c));
                }
                Is${table.modelName}Loading = false;
            });
        }

        /// <summary>
        /// Saves any modified ${table.modelName}s and reloads the ${table.modelName} list from the database.
        /// </summary>
        public void Sync${table.modelName}()
        {
            Task.Run(async () =>
            {
                foreach (var modified${table.modelName} in ${table.modelName}s
                    .Where(${table.modelName.toLowerCase()} => ${table.modelName.toLowerCase()}.IsModified).Select(${table.modelName.toLowerCase()} => ${table.modelName.toLowerCase()}.Model))
                {
                    await App.Repository.${table.modelName}s.UpsertAsync(modified${table.modelName});
                }

                await Get${table.modelName}ListAsync();
            });
        }
        `).join("")}
    }
}
`);
