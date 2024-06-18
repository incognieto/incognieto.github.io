$(document).ready(function(){
    // Fungsi untuk mengisi tabel dengan data dari file JSON
    function fillTable(data) {
        var table = $("#newsTable tbody");
        table.empty(); // Mengosongkan isi tabel sebelum mengisi dengan data baru
        $.each(data, function(index, val){
            var row = $("<tr>");
            row.append($("<td>").text(index + 1)); // Nomor urutan data
            row.append($("<td>").text(val["Judul"]));
            row.append($("<td>").html(val["Waktu Publish"] + "<br>" + formatWaktu(val["Waktu Publish"], val["Waktu Scrapping"])));
            row.append($("<td>").text(val["Kategori"]));
            row.append($("<td>").html("<a href='" + val["Tautan"] + "'><i class='fas fa-paperclip'></i></a>"));
            row.append($("<td>").text(val["Waktu Scrapping"]));
            table.append(row);
        });
    }

    // Mengambil data dari file JSON saat halaman dimuat
    $.getJSON("../data/literatur.json", function(data){
        fillTable(data);
        populateCategoryDropdown(data);
        // Inisialisasi DataTable tanpa fitur pencarian
        $('#newsTable').DataTable({
            searching: false,
            responsive: true
        });
    });

    // Fungsi untuk melakukan pencarian berdasarkan judul
    $("#searchButton").on("click", function() {
        var searchTerm = $("#searchInput").val().toLowerCase();
        var selectedCategory = $("#filterSelect").val();
        $.getJSON("../data/literatur.json", function(data){
            var filteredData = data.filter(function(item) {
                var matchesSearch = item["Judul"].toLowerCase().includes(searchTerm);
                var matchesCategory = selectedCategory === "" || item["Kategori"] === selectedCategory;
                return matchesSearch && matchesCategory;
            });
            fillTable(filteredData);
            // Reinisialisasi DataTable setelah pengisian ulang
            $('#newsTable').DataTable();
        });
    });

    // Fungsi untuk menampilkan hasil filter ketika kategori dipilih
    $("#filterSelect").on("change", function() {
        $("#searchButton").click(); // Memanggil fungsi pencarian setiap kali kategori diubah
    });

    // Fungsi untuk mengubah format waktu
    function formatWaktu(wPublish, wScrapping) {
        var waktuScrapping = new Date(wScrapping);
        var waktuPublish = new Date(wPublish);
        var diffMs = waktuScrapping - waktuPublish;
        var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);

        if (diffMins < 60) {
            return diffMins + " menit yang lalu";
        } else {
            var diffHours = Math.round(diffMins / 60);
            return diffHours + " jam yang lalu";
        }
    }

    // Fungsi untuk mengisi dropdown kategori
    function populateCategoryDropdown(data) {
        var categories = [];
        $.each(data, function(index, val) {
            if (!categories.includes(val["Kategori"])) {
                categories.push(val["Kategori"]);
            }
        });

        var dropdown = $("#filterSelect");
        $.each(categories, function(index, category) {
            dropdown.append($("<option>").text(category));
        });
    }

    // Fungsi untuk mengurutkan data berdasarkan waktu terbit terbaru
    $("#sortLatest").on("click", function() {
        $.getJSON("../data/literatur.json", function(data){
            data.sort(function(a, b) {
                return new Date(b["Waktu Publish"]) - new Date(a["Waktu Publish"]);
            });
            fillTable(data);
            // Reinisialisasi DataTable setelah pengisian ulang
            $('#newsTable').DataTable();
        });
    });

    // Fungsi untuk mengurutkan data berdasarkan waktu terbit tertua
    $("#sortOldest").on("click", function() {
        $.getJSON("../data/literatur.json", function(data){
            data.sort(function(a, b) {
                return new Date(a["Waktu Publish"]) - new Date(b["Waktu Publish"]);
            });
            fillTable(data);
            // Reinisialisasi DataTable setelah pengisian ulang
            $('#newsTable').DataTable();
        });
    });

});