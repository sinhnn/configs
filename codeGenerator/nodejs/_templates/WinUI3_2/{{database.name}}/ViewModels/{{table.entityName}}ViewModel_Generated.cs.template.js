`// Generated on ${new Date()}

using System;
using System.Collections.ObjectModel;
using System.Collections.Generic;
using System.ComponentModel;
using System.Threading.Tasks;
using Microsoft.UI.Dispatching;
using CommunityToolkit.WinUI;
using Microsoft.UI.Xaml.Controls;

using ${context.namespace.ParentNamespace(1)}.Models;

namespace ${context.namespace}
{
    /// <summary>
    /// Provides a bindable wrapper for the ${table.entityName} model class, encapsulating various services for access by the UI.
    /// </summary>
    public partial class ${table.entityName}ViewModel : Common.ViewModels.BindableBase, IEditableObject
    {
        private DispatcherQueue dispatcherQueue = DispatcherQueue.GetForCurrentThread();

        /// <summary>
        /// Initializes a new instance of the ${table.entityName}ViewModel class that wraps a ${table.entityName} object.
        /// </summary>
        public ${table.entityName}ViewModel(${table.entityName} model = null) {
            Model = model ?? new ${table.entityName}();
        } 

        /// <summary>
        /// Initializes a new instance of the ${table.entityName}ViewModel class that wraps a ${table.entityName} object.
        /// </summary>
        public ${table.entityName}ViewModel(${table.entityName} model, ${table.entityName}MainViewModel parent) {
            Model = model ?? new ${table.entityName}();
            _mainViewModel = parent;
        } 

        private ${table.entityName} _model;
        private List<${table.entityName}> _histories = new List<${table.entityName}> {new ${table.entityName}()};
        private ${table.entityName}MainViewModel? _mainViewModel;

        /// <summary>
        /// Gets or sets the underlying ${table.entityName} object.
        /// </summary>
        public ${table.entityName} Model
        {
            get => _model;
            set
            {
                if (_model != value)
                {
                    _model = value;
                    // Raise the PropertyChanged event for all properties.
                    OnPropertyChanged(string.Empty);
                }
            }
        }

        ${table.fields.map(field=> `
        /// <summary>
        /// Gets or sets the ${table.entityName}'s ${field.classMemberName}.
        /// </summary>
        public ${field.destLangType} ${field.classMemberName}
        {
            get => Model.${field.classMemberName};
            set
            {
                if (value != Model.${field.classMemberName})
                {
                    Model.${field.classMemberName} = (${field.destLangType}) value;
                    IsModified = true;
                    OnPropertyChanged();
                }
            }
        }`).join("")}

        /// <summary>
        /// Gets or sets a value that indicates whether the underlying model has been modified. 
        /// </summary>
        /// <remarks>
        /// Used when sync'ing with the server to reduce load and only upload the models that have changed.
        /// </remarks>
        public bool IsModified { get; set; }

        private bool _IsLoading;

        /// <summary>
        /// Gets or sets a value that indicates whether to show a progress bar. 
        /// </summary>
        public bool IsLoading
        {
            get => _IsLoading;
            set => Set(ref _IsLoading, value);
        }

        private bool _isNew;

        /// <summary>
        /// Gets or sets a value that indicates whether this is a new ${table.entityName}.
        /// </summary>
        public bool IsNew
        {
            get => _isNew;
            set => Set(ref _isNew, value);
        }

        private bool _isInEdit = false;

        /// <summary>
        /// Gets or sets a value that indicates whether the ${table.entityName} data is being edited.
        /// </summary>
        public bool IsInEdit
        {
            get => _isInEdit;
            set => Set(ref _isInEdit, value);
        }

        /// <summary>
        /// Saves ${table.entityName} data that has been edited.
        /// </summary>
        public async Task SaveAsync()
        {
            IsInEdit = false;
            IsModified = false;
            if (IsNew)
            {
                IsNew = false;
                this._mainViewModel.DataSource.Add(this);
            }
            await this._mainViewModel.Repository.UpsertAsync(Model);
        }

        /// <summary>
        /// Raised when the user cancels the changes they've made to the ${table.entityName} data.
        /// </summary>
        public event EventHandler AddNewCanceled;

        /// <summary>
        /// Cancels any in progress edits.
        /// </summary>
        public async Task CancelEditsAsync()
        {
            if (IsNew)
            {
                AddNewCanceled?.Invoke(this, EventArgs.Empty);
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
                // await Refresh${table.entityName}FromRepositoryAsync(Model.Id);
                this._model.CopyFrom(this._histories[0]);
                IsModified = false;
            }
        }

        /// <summary>
        /// Enables edit mode.
        /// </summary>
        public void StartEdit() {
            IsInEdit = true;
        } 

        /// <summary>
        /// Reloads all of the ${table.entityName} data.
        /// </summary>
        // public async Task Refresh${table.entityName}FromRepositoryAsync(string Id)
        // {
        //     // await App.${table.entityName.ToVariableName()}MainViewModel.Repository.GetAsync(Model.Id);
        // }

        /// <summary>
        /// Called when a bound DataGrid control causes the ${table.codeName} to enter edit mode.
        /// </summary>
        public void BeginEdit()
        {
            this._histories[0] =  this.Model.Clone();
        }

        /// <summary>
        /// Called when a bound DataGrid control cancels the edits that have been made to a ${table.codeName}.
        /// </summary>
        public async void CancelEdit()
        {
            await CancelEditsAsync();
        } 

        /// <summary>
        /// Called when a bound DataGrid control commits the edits that have been made to a ${table.codeName}.
        /// </summary>
        public async void EndEdit()
        {
            if (!_histories[0].Equals(this.Model))
            {
                // ContentDialog promptDialog = new ContentDialog
                // {
                //     Title = "Confirm Update!!",
                //     Content = "Are you sure to update??",
                //     CloseButtonText = "No",
                //     PrimaryButtonText = "Yes"
                // };
                // promptDialog.XamlRoot = App.Window.Content.;
                // ContentDialogResult result = await promptDialog.ShowAsync();
                // if (result == ContentDialogResult.Primary)

                var confirmResult = System.Windows.Forms.MessageBox.Show("Are you sure to update??", "Confirm Update!!", System.Windows.Forms.MessageBoxButtons.YesNo);
                if (confirmResult == System.Windows.Forms.DialogResult.Yes)
                {
                    await SaveAsync();
                }
                else
                {
                    await RevertChangesAsync();
                }
            }
            IsInEdit = false;
            IsModified = false;
        }
    }
}

`