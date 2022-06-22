for (const table of tables) {
    const outFilePath = `${generatedFileConfig.outDirPath}/${table.codeName}ViewModel.cs`;
    fsCustom.writeFileSync(outFilePath,
`
using System;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Threading.Tasks;
using Microsoft.UI.Dispatching;
using CommunityToolkit.WinUI;
using Contoso.Models;


namespace Contoso.App.ViewModels
{
    /// <summary>
    /// Provides a bindable wrapper for the ${table.modelName} model class, encapsulating various services for access by the UI.
    /// </summary>
    public class ${table.modelName}ViewModel : BindableBase, IEditableObject
    {
        private DispatcherQueue dispatcherQueue = DispatcherQueue.GetForCurrentThread();

        /// <summary>
        /// Initializes a new instance of the ${table.modelName}ViewModel class that wraps a ${table.modelName} object.
        /// </summary>
        public ${table.modelName}ViewModel(${table.modelName} model = null) => Model = model ?? new ${table.modelName}();

        private ${table.modelName} _model;

        /// <summary>
        /// Gets or sets the underlying ${table.modelName} object.
        /// </summary>
        public ${table.modelName} Model
        {
            get => _model;
            set
            {
                if (_model != value)
                {
                    _model = value;
                    // RefreshOrders();

                    // Raise the PropertyChanged event for all properties.
                    OnPropertyChanged(string.Empty);
                }
            }
        }

        ${table.fields.map(field=> `
        /// <summary>
        /// Gets or sets the ${table.modelName}'s ${field.Name}.
        /// </summary>
        public string ${field.Name}
        {
            get => Model.${field.Name};
            set
            {
                if (value != Model.${field.Name})
                {
                    Model.${field.Name} = value;
                    IsModified = true;
                    OnPropertyChanged();
                    OnPropertyChanged(nameof(Name));
                }
            }
        }
        `).join("")
        }

        /// <summary>
        /// Gets or sets a value that indicates whether the underlying model has been modified. 
        /// </summary>
        /// <remarks>
        /// Used when sync'ing with the server to reduce load and only upload the models that have changed.
        /// </remarks>
        public bool IsModified { get; set; }

        /// <summary>
        /// Gets the collection of the ${table.modelName}'s orders.
        /// </summary>
        // public ObservableCollection<Order> ${table.codeName} { get; } = new ObservableCollection<${table.modelName}>();

        private bool _isLoading;

        /// <summary>
        /// Gets or sets a value that indicates whether to show a progress bar. 
        /// </summary>
        public bool IsLoading
        {
            get => _isLoading;
            set => Set(ref _isLoading, value);
        }

        private bool _isNew${table.modelName};

        /// <summary>
        /// Gets or sets a value that indicates whether this is a new ${table.modelName}.
        /// </summary>
        public bool IsNew${table.modelName}
        {
            get => _isNew${table.modelName};
            set => Set(ref _isNew${table.modelName}, value);
        }

        private bool _isInEdit = false;

        /// <summary>
        /// Gets or sets a value that indicates whether the ${table.modelName} data is being edited.
        /// </summary>
        public bool IsInEdit
        {
            get => _isInEdit;
            set => Set(ref _isInEdit, value);
        }

        /// <summary>
        /// Saves ${table.modelName} data that has been edited.
        /// </summary>
        public async Task SaveAsync()
        {
            IsInEdit = false;
            IsModified = false;
            if (IsNew${table.modelName})
            {
                IsNew${table.modelName} = false;
                App.ViewModel.${table.codeName}.Add(this);
            }

            await App.Repository.${table.codeName}.UpsertAsync(Model);
        }

        /// <summary>
        /// Raised when the user cancels the changes they've made to the ${table.modelName} data.
        /// </summary>
        public event EventHandler AddNew${table.modelName}Canceled;

        /// <summary>
        /// Cancels any in progress edits.
        /// </summary>
        public async Task CancelEditsAsync()
        {
            if (IsNew${table.modelName})
            {
                AddNew${table.modelName}Canceled?.Invoke(this, EventArgs.Empty);
            }
            else
            {
                await RevertChangesAsync();
            }
        }

        /// <summary>
        /// Discards any edits that have been made, restoring the original values.
        /// </summary>
        public async Task RevertChangesAsync()
        {
            IsInEdit = false;
            if (IsModified)
            {
                await Refresh${table.modelName}Async();
                IsModified = false;
            }
        }

        /// <summary>
        /// Enables edit mode.
        /// </summary>
        public void StartEdit() => IsInEdit = true;

        /// <summary>
        /// Reloads all of the ${table.modelName} data.
        /// </summary>
        public async Task Refresh${table.modelName}Async()
        {
            // RefreshOrders();
            Model = await App.Repository.${table.codeName}.GetAsync(Model.Id);
        }

        /// <summary>
        /// Called when a bound DataGrid control causes the ${table.codeName} to enter edit mode.
        /// </summary>
        public void BeginEdit()
        {
            // Not used.
        }

        /// <summary>
        /// Called when a bound DataGrid control cancels the edits that have been made to a ${table.codeName}.
        /// </summary>
        public async void CancelEdit() => await CancelEditsAsync();

        /// <summary>
        /// Called when a bound DataGrid control commits the edits that have been made to a ${table.codeName}.
        /// </summary>
        public async void EndEdit() => await SaveAsync();
    }
}

`);
}