`
// Generated on ${new Date()}
using CommunityToolkit.WinUI;
using Microsoft.UI.Dispatching;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading.Tasks;

using ${context.namespace.ParentNamespace(1)}.Models;
using ${context.namespace.ParentNamespace(1)}.Repository;


namespace ${context.namespace}
{
    /// <summary>
    /// Provides data and commands accessible to the entire app.  
    /// </summary>
    public partial class ${table.entityName}MainViewModel : Common.ViewModels.BindableBase
    {
        private DispatcherQueue dispatcherQueue = DispatcherQueue.GetForCurrentThread();
        private I${table.entityName}Repository repository;
        public I${table.entityName}Repository Repository {
            get => this.repository;
            set => this.repository = value;
        }

        /// <summary>
        /// Creates a new MainViewModel.
        /// </summary>
        public ${table.entityName}MainViewModel()
        {

        }

        /// <summary>
        /// Creates a new MainViewModel.
        /// </summary>
        public ${table.entityName}MainViewModel(I${table.entityName}Repository repository) {
            this.repository = repository;
        }

        /// <summary>
        /// Load all entities from all tables.
        /// </summary>
        public void LoadAll() {
            Task.Run(async() => {
                await GetListAsync();
            });
        }

        /// <summary>
        /// The collection of ${table.entityName}s in the list. 
        /// </summary>
        public ObservableCollection<${table.entityName}ViewModel> FilteredList { get; } = new ObservableCollection<${table.entityName}ViewModel>();

        /// <summary>
        /// The collection of ${table.entityName}s in the list as cached to avoid fetch data from db frequently. 
        /// </summary>
        public ObservableCollection<${table.entityName}ViewModel> DataSource { get; } = new ObservableCollection<${table.entityName}ViewModel>();

        /// <summary>
        /// The collection of search suggestion. 
        /// </summary>
        // public ObservableCollection<string> ${table.entityName}SearchSuggestionObservableCollection { get; } = new ObservableCollection<string>();

        private ${table.entityName}ViewModel _selectedItem;

        /// <summary>
        /// Gets or sets the selected ${table.entityName}, or null if no ${table.entityName} is selected. 
        /// </summary>
        public ${table.entityName}ViewModel SelectedItem
        {
            get => _selectedItem;
            set => Set(ref _selectedItem, value);
        }

        private bool _isLoading = false;

        /// <summary>
        /// Gets or sets a value indicating whether the ${table.entityName}s list is currently being updated. 
        /// </summary>
        public bool IsLoading
        {
            get => _isLoading;
            set => Set(ref _isLoading, value);
        }

        /// <summary>
        /// Gets the complete list of ${table.entityName}s from the database.
        /// </summary>
        public async Task GetListAsync()
        {
            await dispatcherQueue.EnqueueAsync(() => IsLoading = true);

            var items = await this.repository.GetAsync();
            if (items == null)
            {
                return;
            }

            await dispatcherQueue.EnqueueAsync(() =>
            {
                FilteredList.Clear();
                DataSource.Clear();
                foreach (${table.entityName} c in items)
                {
                    FilteredList.Add(new ${table.entityName}ViewModel(c));
                    DataSource.Add(new ${table.entityName}ViewModel(c));
                }
                IsLoading = false;
            });
        }

        /// <summary>
        /// Gets the complete list of ${table.entityName}ViewModel from the database.
        /// </summary>
        public async Task Remove(List<${table.entityName}ViewModel> items)
        {
            await dispatcherQueue.EnqueueAsync(() => IsLoading = true);
            await dispatcherQueue.EnqueueAsync(() =>
            {

                foreach (${table.entityName}ViewModel c in items)
                {
                    FilteredList.Remove(c);
                    DataSource.Remove(c);
                    Repository.Remove(c.Model);
                }
                IsLoading = false;
            });
        }

        public async Task UpsertAsync(List<${table.entityName}ViewModel> items)
        {
            await dispatcherQueue.EnqueueAsync(() => IsLoading = true);
            await dispatcherQueue.EnqueueAsync(() =>
            {
                foreach (${table.entityName}ViewModel c in items)
                {
                    FilteredList.Add(c);
                    DataSource.Add(c);
                    Repository.UpsertAsync(c.Model);
                }
                IsLoading = false;
            });
            await GetListAsync();
        }

        /// <summary>
        /// Saves any modified ${table.entityName}s and reloads the ${table.entityName} list from the database.
        /// </summary>
        public void Sync()
        {
            Task.Run(async () =>
            {
                foreach (var modifiedItem in DataSource
                    .Where(item => item.IsModified)
                    .Select(item => item.Model))
                {
                    await this.repository.UpsertAsync(modifiedItem);
                }

                await GetListAsync();
            });
        }
    }
}
`